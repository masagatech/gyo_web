import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeaveService } from '@services/erp';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rpttchrlv.comp.html',
    providers: [CommonService]
})

export class TeacherLeaveReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    header: any;
    event: MyEvent;
    dialogVisible: boolean = false;
    idGen: number = 100;
    defaultDate: string = "";

    leaveDT: any = [];
    leaveReportsDT: any = [];

    @ViewChild('class') class: ElementRef;

    gridTotal: any = {
        strenthTotal: 0, studentsTotal: 0, openingTotal: 0
    };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _lvrptservice: LeaveService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDefaultDate();
        this.getTeacherLeave();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
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

    getDefaultDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.defaultDate = this.formatDate(today);
    }

    // Fill Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._lvrptservice.getTeacherLeave({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin,
            "viewby": "portal"
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
                
                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getTeacherLeave();
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

    // Export

    public exportToCSV() {
        var that = this;
        commonfun.loader();

        that._lvrptservice.getTeacherLeave({
            "flag": "reports", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, "Leave");
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
            pdf.save("Leave.pdf");
        });
    }

    getTeacherLeave() {
        var that = this;
        commonfun.loader();

        that._lvrptservice.getTeacherLeave({
            "flag": "calendar", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "status": -1
        }).subscribe(data => {
            try {
                that.leaveDT = data.data;
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

    handleEventClick(e) {
        var that = this;
        commonfun.loader();

        that._lvrptservice.getTeacherLeave({
            "flag": "reports", "tchrid": e.calEvent.tchrid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.leaveReportsDT = data.data;
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

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
}