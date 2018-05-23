import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LogReportService } from '@services/reports';
import { LoginUserModel, Globals, Common } from '@models';

@Component({
    templateUrl: 'rptll.comp.html'
})

export class LoginLogReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    frmdt: any = "";
    todt: any = "";
    uid: number = 0;

    loginlogDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _logrptservice: LogReportService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.setFromDateAndToDate();
        this.getLoginLog();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    setFromDateAndToDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(today);
        this.todt = this.formatDate(today);
    }

    // Get Login Log

    getLoginLog() {
        var that = this;
        commonfun.loader();

        that._logrptservice.getLoginLogReports({ "flag": "all", "frmdt": that.frmdt, "todt": that.todt }).subscribe(data => {
            try {
                that.loginlogDT = JSON.parse(data._body).data[0];
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

    // Download

    public downloadReports(row, format) {
        var that = this;
        var params = { "flag": "reports", "uid": row.uid, "frmdt": that.frmdt, "todt": that.todt, "format": format }

        window.open(Common.getReportUrl("getLoginLogReports", params));
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
