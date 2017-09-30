import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassScheduleService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptclssch.comp.html',
    providers: [CommonService]
})

export class ClassScheduleReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    schtype: string = "weekly";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    teacherDT: any = [];
    tchrdata: any = [];
    tchrid: number = 0;
    tchrname: string = "";

    classScheduleColumn: any = [];
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
        this.getClassScheduleData();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".entityname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Class Drop Down

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

    // Auto Completed Teacher

    getTeacherData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "teacher",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "emptype": "tchr",
            "classid": this.classid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.teacherDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Teacher

    selectTeacherData(event) {
        this.tchrid = event.value;
        this.tchrname = event.label;
        this.getClassScheduleData();
    }

    // Export

    public exportToCSV() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": that.schtype, "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, "Class Schedule");
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
            pdf.save("Class Schedule.pdf");
        });
    }

    // Get Class Scedule Data

    getClassScheduleData() {
        var that = this;

        if (that.schtype == "weekly") {
            that.getWeeklyClassSchedule();
        }
        else {
            that.getMonthlyClassSchedule();
        }
    }

    getMonthlyClassSchedule() {
        var that = this;

        that._clsrstservice.getClassSchedule({
            "flag": "column", "ayid": that.ayid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.classScheduleColumn = data.data;
                that.getWeeklyClassSchedule();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getWeeklyClassSchedule() {
        var that = this;
        commonfun.loader();

        that._clsrstservice.getClassSchedule({
            "flag": that.schtype, "ayid": that.ayid, "classid": that.classid, "tchrid": that.tchrid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "viewby": "portal"
        }).subscribe(data => {
            try {
                that.classScheduleDT = data.data;
                that.grandTotal();
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

    grandTotal() {
        var that = this;
        that.gridTotal = {
            strenthTotal: 0, studentsTotal: 0, openingTotal: 0
        };

        for (var i = 0; i < this.classDT.length; i++) {
            var items = this.classDT[i];

            that.gridTotal.strenthTotal += parseFloat(items.strength);
            that.gridTotal.studentsTotal += parseFloat(items.totstuds);
            that.gridTotal.openingTotal += parseFloat(items.opening);
        }
    }

    resetClassScheduleDetails() {
        this.tchrdata = [];
        this.tchrid = 0;
        this.tchrname = ""
        this.getClassScheduleData();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
