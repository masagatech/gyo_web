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

    psngrtype: any = "emp";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    attnddate: any = "";

    passengerDT: any = [];

    global = new Globals();

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _attndservice: AttendanceService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getPassengerDetails();
        this.getAttendanceDate();
        // this.hideWhenAttendance();
    }

    public ngOnInit() {

    }

    hideWhenAttendance() {
        if (this.loginUser.ctype == "prncpl") {
            $("#psngrtype").prop("disabled", "disabled");
            this.psngrtype = "emp";
        }
        else if (this.loginUser.ctype == "tchr") {
            this.psngrtype = this._enttdetails.psngrtype;
            $("#psngrtype").prop("disabled", "disabled");
            $("#clsid").prop("disabled", "disabled");
        }
        else {
            this.psngrtype = "emp";
        }
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
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
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

    getPassengerDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": that.psngrtype, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that._enttdetails.issysadmin,
            "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        that._attndservice.getAttendance(params).subscribe(data => {
            try {
                that.passengerDT = data.data;
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

    // Apsent

    apsentPassenger(row) {
        row.status = "a";
    }

    // Present

    presentPassenger(row) {
        row.status = "p";
    }

    saveAttendance() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Academic Year");
            $(".ay").focus();
            return false;
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Class");
            $(".class").focus();
            return false;
        }
        else {
            commonfun.loader();

            for (var i = 0; i < that.passengerDT.length; i++) {
                var field = that.passengerDT[i];

                that.passengerDT[i].attndid = field.attndid;
                that.passengerDT[i].psngrid = field.psngrid;
                that.passengerDT[i].psngrtype = that.psngrtype;
                that.passengerDT[i].attnddate = that.attnddate;
                that.passengerDT[i].status = field.status;
                that.passengerDT[i].ayid = that.ayid;
                that.passengerDT[i].clsid = that.classid;
                that.passengerDT[i].enttid = that._enttdetails.enttid;
                that.passengerDT[i].wsautoid = that._enttdetails.wsautoid;
                that.passengerDT[i].cuid = that.loginUser.uid;
                that.passengerDT[i].isactive = true;
            }

            that._attndservice.saveAttendance({ "attendance": that.passengerDT }).subscribe(data => {
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
