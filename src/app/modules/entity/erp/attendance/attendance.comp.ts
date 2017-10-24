import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AttendanceService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'attendance.comp.html',
    providers: [CommonService]
})

export class AttendanceComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    psngrtype: any = "";
    psngrtypenm: any = "";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    attnddate: any = "";

    attendanceDT: any = [];

    statusid: number = 0;
    statusdesc: string = "";

    global = new Globals();

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _attndservice: AttendanceService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getAttendanceDate();
        this.getAttendance();
        // this.hideWhenAttendance();
    }

    public ngOnInit() {
        var that = this;
    }

    // Format Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getAttendanceDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.attnddate = this.formatDate(today);
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.chevronstyle();
        }, 0);
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getAttendance();
                }

                that.classDT = data.data.filter(a => a.group == "class");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    getAttendance() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];

                if (that.psngrtype == "student") {
                    that.psngrtypenm = 'Student';
                }
                else if (that.psngrtype == "teacher") {
                    that.psngrtypenm = 'Teacher';
                    that.classid = 0;
                }
                else {
                    that.psngrtypenm = 'Employee';
                    that.classid = 0;
                }

                params = {
                    "flag": "attendance", "psngrtype": that.psngrtype, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "issysadmin": that.loginUser.issysadmin, "ayid": that.ayid, "classid": that.classid, "attnddate": that.attnddate,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }

                that._attndservice.getAttendance(params).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.attendanceDT = data.data;
                            that.statusid = data.data[0].statusid;

                            if (that.statusid == 0) {
                                that.statusdesc = data.data[0].statusdesc;
                            }
                        }
                        else {
                            that.attendanceDT = [];
                            that.statusid = 0;
                            that.statusdesc = "";
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                    commonfun.loaderhide();
                }, () => {

                })
            }
            else {
                commonfun.loaderhide();
            }
        });
    }

    // Absent

    absentPassenger(row) {
        row.status = "a";
    }

    // Present

    presentPassenger(row) {
        row.status = "p";
    }

    isValidation() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Academic Year");
            $(".ay").focus();
            return false;
        }
        else if (that.psngrtype != "employee") {
            if (that.classid == 0) {
                that._msg.Show(messageType.info, "Info", "Select Class");
                $(".class").focus();
                return false;
            }
        }

        return true;
    }

    saveAttendance() {
        var that = this;

        var isvalid = that.isValidation();

        if (isvalid) {
            commonfun.loader();

            for (var i = 0; i < that.attendanceDT.length; i++) {
                var field = that.attendanceDT[i];

                that.attendanceDT[i].attndid = field.attndid;
                that.attendanceDT[i].psngrid = field.psngrid;
                that.attendanceDT[i].psngrtype = that.psngrtype;
                that.attendanceDT[i].attnddate = that.attnddate;
                that.attendanceDT[i].status = field.status;
                that.attendanceDT[i].ayid = that.ayid;
                that.attendanceDT[i].clsid = that.classid;
                that.attendanceDT[i].enttid = that._enttdetails.enttid;
                that.attendanceDT[i].wsautoid = that._enttdetails.wsautoid;
                that.attendanceDT[i].cuid = that.loginUser.uid;
                that.attendanceDT[i].isactive = true;
            }

            that._attndservice.saveAttendance({ "attendance": that.attendanceDT.filter(a => a.status == "a") }).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_attendance;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {

                        }
                        else {

                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }
}
