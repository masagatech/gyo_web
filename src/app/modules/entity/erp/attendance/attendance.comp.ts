import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AttendanceService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'attendance.comp.html'
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

    attndtypeDT: any = [];
    attndtype: string = "class";

    avlattnddate: any = "";
    attnddate: any = "";

    attendanceDT: any = [];
    absentDT: any = [];

    statusid: number = 0;
    status: string = "";
    statusdesc: string = "";

    global = new Globals();

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _attndservice: AttendanceService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {

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

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];
        var defAttndDT: any = [];

        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = 0;
                        }
                    }
                }

                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                that.attnddate = that.formatDate(today);

                defAttndDT = data.data.filter(a => a.group == "setattendaceday");

                if (defAttndDT.length > 0) {
                    var attndday = parseInt(defAttndDT[0].val);
                    var setbeforedate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - attndday);

                    that.avlattnddate = that.formatDate(setbeforedate);
                }
                else {
                    that.avlattnddate = that.formatDate(today);
                }

                that.classDT = data.data.filter(a => a.group == "class");
                that.attndtypeDT = data.data.filter(a => a.group == "attendancetype");

                that.getAttendance();
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
        var _params = {};

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
            }
            else {
                that.psngrtype = "passenger";
                that.psngrtypenm = 'Passenger';
            }

            _params = {
                "flag": "attendance", "psngrtype": that.psngrtype, "attnddate": that.attnddate, "attndtype": that.attndtype,
                "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin
            }

            that._attndservice.getAttendance(_params).subscribe(data => {
                try {
                    if (data.data.length > 0) {
                        that.attendanceDT = data.data;
                        that.absentDT = that.attendanceDT.filter(a => a.status == "a");

                        that.statusid = data.data[0].statusid;
                        that.status = data.data[0].status;

                        if (that.statusid == 0 && that.status != "lv") {
                            that.statusdesc = data.data[0].statusdesc;
                        }
                    }
                    else {
                        that.attendanceDT = [];
                        that.absentDT = [];
                        that.statusid = 0;
                        that.status = "";
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
        });
    }

    // Absent

    absentPassenger(row) {
        row.status = "a";
        this.absentDT = this.attendanceDT.filter(a => a.status == "a");
        $("#selectall").prop('checked', false);
    }

    // Present

    presentPassenger(row) {
        row.status = "p";
        this.absentDT = this.attendanceDT.filter(a => a.status == "a");

        if (this.absentDT.length == 0) {
            $("#selectall").prop('checked', true);
        }
        else {
            $("#selectall").prop('checked', false);
        }
    }

    isValidation() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Academic Year");
            $(".ay").focus();
            return false;
        }
        if (that.psngrtype == "student") {
            if (that.classid == 0) {
                that._msg.Show(messageType.info, "Info", "Select Class");
                $(".class").focus();
                return false;
            }
        }
        if (that.attndtype == "") {
            that._msg.Show(messageType.info, "Info", "Select Attendance Type");
            $(".attndtype").focus();
            return false;
        }
        if (!$("#selectall").is(':checked') && that.absentDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "Select All Checkbox / Select Atleast 1 " + that.psngrtypenm + " For Absent");
            return false;
        }

        return true;
    }

    saveAttendance() {
        var that = this;
        var isvalid = that.isValidation();

        if (isvalid) {
            commonfun.loader();

            var _psngrid: string[] = [];
            var _attndid: number = 0;
            var params = {};

            _psngrid = Object.keys(that.absentDT).map(function (k) { return that.absentDT[k].psngrid });

            if (that.absentDT.length > 0) {
                _attndid = that.absentDT[0].attndid;
            }
            else {
                _attndid = 0;
            }

            params = {
                "attndid": _attndid,
                "attndtype": that.attndtype,
                "psngrid": _psngrid,
                "psngrtype": that.psngrtype,
                "attnddate": that.attnddate,
                "frmid": that.loginUser.uid,
                "frmtype": that.loginUser.utype,
                "status": "a",
                "ayid": that.ayid,
                "classid": that.classid,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "isactive": true
            }

            that._attndservice.saveAttendance(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_attendance;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
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
