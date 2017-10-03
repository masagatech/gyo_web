import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassScheduleService } from '@services/erp';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptprdclssch.comp.html',
    providers: [CommonService]
})

export class PeriodClassScheduleReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    weekperiodDT: any = [];

    fweek: number = 0;
    lweek: number = 0;
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

    classScheduleDT: any = [];
    @ViewChild('class') class: ElementRef;

    gridTotal: any = {
        strenthTotal: 0, studentsTotal: 0, openingTotal: 0
    };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsrstservice: ClassScheduleService) {
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
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin,
            "viewby": "portal"
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getWeekPeriodData();
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

        that._clsrstservice.getClassSchedule({
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
                }
                else {
                    that.fweek = 0;
                    that.lweek = 0;
                    that.weekid = 0;
                    that.weekhead = "";
                }

                that.getWeekColumn();
                that.getPeriodClassSchedule();
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

        that._clsrstservice.getClassSchedule({
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

    getPeriodClassSchedule() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "period", "ayid": that.ayid, "classid": 0, "weekid": that.weekid, "tchrid": 0, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                that.classScheduleDT = data.data;
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
        this.weekno = this.fweek;

        if (this.fweek >= this.weekno) {
            this.getWeekPeriodData();
        }
    }

    // Next Week

    nextWeekPeriodData() {
        this.weekno = parseInt(this.weekno.toString()) + 1;

        if (this.lweek >= this.weekno) {
            this.getWeekPeriodData();
        }
    }

    // Previous Week

    previousWeekPeriodData() {
        this.weekno = parseInt(this.weekno.toString()) - 1;

        if (this.weekno >= this.fweek) {
            this.getWeekPeriodData();
        }
    }

    // Last Week

    lastWeekPeriodData() {
        this.weekno = this.lweek;

        if (this.lweek >= this.weekno) {
            this.getWeekPeriodData();
        }
    }

    // Export

    public exportToCSV() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": "weekly", "ayid": that.ayid, "classid": 0, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, "Weekly Class Schedule");
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

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.class.nativeElement, 0, 0, options, () => {
            pdf.save("Weekly Class Schedule.pdf");
        });
    }

    resetClassScheduleDetails() {
        this.getWeekPeriodData();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
