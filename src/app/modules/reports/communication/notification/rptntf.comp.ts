import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { NotificationService } from '@services/reports';

@Component({
    templateUrl: 'rptntf.comp.html'
})

export class NotificationReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    type: string = "";
    frmdt: string = "";
    todt: string = "";

    groupDT: any = [];
    grpid: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _ntfservice: NotificationService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.fillGroupDropDown();
        this.getNotificationReports("html");
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

        that._ntfservice.getNotification(params).subscribe(data => {
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

    // Notification

    getNotificationReports(format) {
        var that = this;
        let params = {};

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['type'] !== undefined) {
                that.type = params['type'];

                params = {
                    "flag": "reports", "type": that.type, "grpid": that.grpid, "frmdt": that.frmdt, "todt": that.todt, "ntftype": "other",
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
                }

                if (format == "html") {
                    commonfun.loader();

                    that._ntfservice.getNotification(params).subscribe(data => {
                        try {
                            $("#divnotification").html(data._body);
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
                    window.open(Common.getReportUrl("getNotification", params));
                }
            }
        });
    }

    // Notification

    resetNotificationReports() {
        var that = this;

        that.grpid = 0;
        that.setFromDateAndToDate();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        
        this.subscribeParameters.unsubscribe();
    }
}
