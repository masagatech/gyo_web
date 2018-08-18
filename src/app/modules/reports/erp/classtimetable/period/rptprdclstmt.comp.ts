import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { ClassTimeTableService } from '@services/erp';

@Component({
    templateUrl: 'rptprdclstmt.comp.html',
    providers: [CommonService]
})

export class PeriodClassTimeTableReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    weekperiodDT: any = [];

    fweek: number = 0;
    lweek: number = 0;
    pageno: number = 1;
    weekno: number = 1;
    weekid: number = 0;
    weekhead: string = "";

    monweekcolumn: any = [];
    tueweekcolumn: any = [];
    wedweekcolumn: any = [];
    thuweekcolumn: any = [];
    friweekcolumn: any = [];
    satweekcolumn: any = [];
    sunweekcolumn: any = [];

    mondate: string = "";
    tuedate: string = "";
    weddate: string = "";
    thudate: string = "";
    fridate: string = "";
    satdate: string = "";
    sundate: string = "";

    classTimeTableDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsrstservice: ClassTimeTableService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._clsrstservice.getClassTimeTable({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin,
            "viewby": "portal"
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (sessionStorage.getItem("_ayid_") != null) {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                        
                        that.getWeekPeriodData();
                    }
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

    // Get Class Scedule Data

    getWeekPeriodData() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassTimeTable({
            "flag": "weekperiod", "ayid": that.ayid, "classid": 0, "weekno": that.weekno, "tchrid": 0, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                that.weekperiodDT = data.data;

                if (data.data.length > 0) {
                    that.fweek = data.data[0].fweek;
                    that.lweek = data.data[0].lweek;
                    that.weekid = data.data[0].weekid;
                    that.weekhead = data.data[0].weekhead;

                    that.mondate = data.data[0].mondate;
                    that.tuedate = data.data[0].tuedate;
                    that.weddate = data.data[0].weddate;
                    that.thudate = data.data[0].thudate;
                    that.fridate = data.data[0].fridate;
                    that.satdate = data.data[0].satdate;
                    that.sundate = data.data[0].sundate;
                }
                else {
                    that.fweek = 0;
                    that.lweek = 0;
                    that.weekid = 0;
                    that.weekhead = "";

                    that.mondate = "";
                    that.tuedate = "";
                    that.weddate = "";
                    that.thudate = "";
                    that.fridate = "";
                    that.satdate = "";
                    that.sundate = "";
                }

                that.getWeekColumn();
                that.getPeriodClassTimeTable();
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

    getWeekColumn() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassTimeTable({
            "flag": "weekcolumn", "ayid": that.ayid, "classid": 0, "weekid": that.weekid, "tchrid": 0, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                that.monweekcolumn = data.data.filter(a => a.week == "Monday");
                that.tueweekcolumn = data.data.filter(a => a.week == "Tuesday");
                that.wedweekcolumn = data.data.filter(a => a.week == "Wednesday");
                that.thuweekcolumn = data.data.filter(a => a.week == "Thursday");
                that.friweekcolumn = data.data.filter(a => a.week == "Friday");
                that.satweekcolumn = data.data.filter(a => a.week == "Saturday");
                that.sunweekcolumn = data.data.filter(a => a.week == "Sunday");
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

    // Get Class Scedule Data

    getPeriodClassTimeTable() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassTimeTable({
            "flag": "period", "ayid": that.ayid, "classid": 0, "weekid": that.weekid, "tchrid": 0, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                that.classTimeTableDT = data.data;
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

    // First Week

    firstWeekPeriodData() {
        if (this.fweek != this.weekno) {
            this.weekno = this.fweek;
            this.pageno = this.fweek;
            this.getWeekPeriodData();
        }
    }

    // Next Week

    nextWeekPeriodData() {
        if (this.weekno != this.lweek) {
            this.weekno = parseInt(this.weekno.toString()) + 1;

            if (this.lweek >= this.weekno) {
                this.pageno = this.weekno;
                this.getWeekPeriodData();
            }
        }
    }

    // Direct Week

    directWeekPeriodData() {
        if (this.weekno != this.pageno) {
            if (this.pageno < this.fweek) {
                this.pageno = this.fweek;
            }
            else if (this.pageno >= this.lweek) {
                this.pageno = this.lweek;
            }

            this.weekno = this.pageno;
            this.getWeekPeriodData();
        }
    }

    // Previous Week

    previousWeekPeriodData() {
        if (this.weekno != this.fweek) {
            this.weekno = parseInt(this.weekno.toString()) - 1;

            if (this.weekno >= this.fweek) {
                this.pageno = this.weekno;
                this.getWeekPeriodData();
            }
        }
    }

    // Last Week

    lastWeekPeriodData() {
        if (this.lweek != this.weekno) {
            this.weekno = this.lweek;
            this.pageno = this.lweek;
            this.getWeekPeriodData();
        }
    }

    // Download

    public downloadReports(format) {
        var that = this;
        commonfun.loader();

        var params = {
            "ayid": that.ayid, "weekno": that.weekno, "weekid": that.weekid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin,
            "viewby": "portal", "format": format
        }

        window.open(Common.getReportUrl("getClassTimeTablePeriod", params));
        commonfun.loaderhide();
    }

    resetClassTimeTableDetails() {
        this.getWeekPeriodData();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
