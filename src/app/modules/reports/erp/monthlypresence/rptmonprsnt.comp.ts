import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { AttendanceService } from '@services/erp';
import { AttendanceReportsService } from '@services/reports';

@Component({
    templateUrl: 'rptmonprsnt.comp.html'
})

export class MonthlyPresenceReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    attndmonthDT: any = [];
    attndmonth: string = "";

    attndtypeDT: any = [];
    attndtype: string = "class";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _attndservice: AttendanceService, private _attndrptservice: AttendanceReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Fill Standard DropDown

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

    public getMonthlyPresence(format) {
        var that = this;

        var dparams = {
            "flag": "monthlypresence", "type":"download", "attndmonth": that.attndmonth, "attndtype": that.attndtype,
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._attndrptservice.getStudentAttendanceReports(dparams).subscribe(data => {
                try {
                    $("#divrptmonprsnt").html(data._body);
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
            window.open(Common.getReportUrl("getStudentAttendanceReports", dparams));
            commonfun.loaderhide();
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
