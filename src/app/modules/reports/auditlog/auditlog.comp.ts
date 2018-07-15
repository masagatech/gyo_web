import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { LogReportService } from '@services/reports';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'auditlog.comp.html'
})

export class AuditLogComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    module: string = "";

    ayDT: any = [];
    ayid: number = 0;

    frmdt: string = "";
    todt: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _logrptservice: LogReportService) {
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

    // Fill Academic Year, Class And Attendance Type Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._logrptservice.getAuditLogReports({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var ddldata = JSON.parse(data._body).data[0];
                that.ayDT = ddldata.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                    }
                }

                that.getAuditLogReports("html");
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

    // Set From Date and To Date

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

    // Get Audit Log

    getAuditLogReports(format) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['module'] !== undefined) {
                that.module = params['module'];
            }

            params = {
                "flag": "reports", "module": that.module, "id": "0", "ayid": that.ayid, "frmdt": that.frmdt, "todt": that.todt,
                "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
            }

            if (format == "html") {
                commonfun.loader();

                that._logrptservice.getAuditLogReports(params).subscribe(data => {
                    try {
                        $("#divauditlog").html(data._body);
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
                window.open(Common.getReportUrl("getAuditLogReports", params));
                commonfun.loaderhide();
            }
        });
    }

    // Reset Audit Log

    resetAuditLogReports() {
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        
        this.subscribeParameters.unsubscribe();
    }
}
