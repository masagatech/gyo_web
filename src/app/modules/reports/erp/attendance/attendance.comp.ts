import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { AttendanceService } from '@services/erp';
import { AttendanceReportsService } from '@services/reports';

@Component({
    templateUrl: 'attendance.comp.html'
})

export class AttendanceReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    psngrtype: string = "";
    psngrtypenm: string = "";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    genderDT: any = [];
    gender: string = "";

    attndmonthDT: any = [];
    attndmonth: string = "";

    attndtypeDT: any = [];
    attndtype: string = "class";

    attendanceColumn: any = [];
    monthColumn: any = [];
    attendanceDT: any = [];
    exportAttendanceDT: any = [];

    statusid: number = 0;
    status: string = "";
    statusdesc: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _attndservice: AttendanceService, private _attndrptservice: AttendanceReportsService, ) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAttendanceType();
        this.fillDropDownList();
        this.fillMonthDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Get Attendance Type

    getAttendanceType() {
        var that = this;

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
                that.classid = 0;
            }
        }, () => {

        })
    }

    // Fill Academic Year, Class And Attendance Type Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.fillMonthDropDown();
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data.filter(a => a.group == "class");
                that.genderDT = data.data.filter(a => a.group == "gender");
                that.attndtypeDT = data.data.filter(a => a.group == "attendancetype");
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

    // Fill Month Drop Down

    fillMonthDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._attndservice.getAttendance({
            "flag": "month", "ayid": that.ayid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.attndmonthDT = data.data;
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

    // Download Reports In Excel And PDF

    public getAttendanceReports(format) {
        var that = this;

        var dparams = {
            "flag": "reports", "psngrtype": that.psngrtype, "attndmonth": that.attndmonth, "attndtype": that.attndtype,
            "ayid": that.ayid, "classid": that.classid, "gender": that.gender, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "format": format
        }

        if (format == "html") {
            commonfun.loader();

            that._attndrptservice.getAttendanceReports(dparams).subscribe(data => {
                try {
                    $("#divattendance").html(data._body);
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
            window.open(Common.getReportUrl("getAttendanceReports", dparams));
        }
    }

    // Reports For Attendance

    // Get Attendent Column

    getAttendanceColumn() {
        var that = this;

        that._attndservice.getAttendance({
            "flag": "column", "ayid": that.ayid, "enttid": that._enttdetails.enttid, "attndmonth": that.attndmonth
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attendanceColumn = data.data;
                that.monthColumn = data.data.filter(a => a.id == 1);
                that.getAttendanceData();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    // Get Attendent Data

    getAttendanceData() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "reports", "psngrtype": that.psngrtype, "attndmonth": that.attndmonth, "attndtype": that.attndtype,
            "ayid": that.ayid, "classid": that.classid, "gender": that.gender, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin
        }

        that._attndservice.getAttendance(params).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.attendanceDT = data.data;

                    that.statusid = data.data[0].statusid;
                    that.status = data.data[0].status;

                    if (that.statusid == 0 && that.status != "lv") {
                        that.statusdesc = data.data[0].statusdesc;
                    }
                }
                else {
                    that.attendanceDT = [];
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
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
