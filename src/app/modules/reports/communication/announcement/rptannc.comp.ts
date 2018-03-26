import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { AnnouncementService } from '@services/reports';

@Component({
    templateUrl: 'rptannc.comp.html'
})

export class AnnouncementReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    frmdt: string = "";
    todt: string = "";

    groupDT: any = [];
    grpid: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _anncservice: AnnouncementService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.fillGroupDropDown();
        this.getAnnouncementReports("html");
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    setFromDateAndToDate() {
        var date = new Date();
        var before1month = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before1month);
        this.todt = this.formatDate(today);
    }

    fillGroupDropDown() {
        let that = this;
        let params = {};

        params = { "flag": "dropdown" }

        commonfun.loader();

        that._anncservice.getAnnouncement(params).subscribe(data => {
            try {
                that.groupDT = JSON.parse(data._body).data;
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

        });
    }

    // Announcement

    getAnnouncementReports(format) {
        var that = this;
        let params = {};

        params = {
            "flag": "reports", "grpid": that.grpid, "frmdt": that.frmdt, "todt": that.todt,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
        }

        if (format == "html") {
            commonfun.loader();

            that._anncservice.getAnnouncement(params).subscribe(data => {
                try {
                    $("#divannouncement").html(data._body);
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
            window.open(Common.getReportUrl("getAnnouncement", params));
        }
    }

    // Announcement

    resetAnnouncementReports() {
        var that = this;

        that.grpid = 0;
        that.setFromDateAndToDate();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
