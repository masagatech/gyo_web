import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var google: any;

@Component({
    templateUrl: 'rptdailyfees.comp.html'
})

export class DailyFeesReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    schoolDT: any = [];
    enttid: number = 0;

    studentDT: any = [];
    selectedStudent = [];
    studid: number = 0;
    studname: string = "";

    frmdt: string = "";
    todt: string = "";

    constructor(private _router: Router, private _routeParams: ActivatedRoute, private _msg: MessageService,
        private _loginservice: LoginService, private _feesservice: FeesService, private _feesrptservice: FeesReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillSchoolDropDown();
    }

    public ngOnInit() {

    }

    // Fill School Drop Down

    fillSchoolDropDown() {
        var that = this;
        var defschoolDT: any = [];

        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.schoolDT = data.data[0];

                if (that.schoolDT.length > 0) {
                    defschoolDT = that.schoolDT.filter(a => a.iscurrent == true);

                    if (defschoolDT.length > 0) {
                        that.enttid = defschoolDT[0].enttid;
                    }
                    else {
                        that.enttid = that._enttdetails.enttid;
                    }

                    that.getFeesReports("html");
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

    // Auto Completed Student

    getStudentData(event) {
        let that = this;
        let query = event.query;

        that._autoservice.getERPAutoData({
            "flag": "student",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            that.studentDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;
    }

    // Set From Date And To Date

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

    // Get Fees Reports

    getFeesReports(format) {
        var that = this;
        var isvalid: boolean = false;
        var feesparams = {};

        feesparams = {
            "flag": "dailywise", "type": "download", "ayid": 0, "stdid": 0, "studid": that.studid, "frmdt": that.frmdt, "todt": that.todt,
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid, "isschlogo": format == "pdf" ? true : false, "format": format
        }

        if (format == "html") {
            commonfun.loader();

            that._feesrptservice.getFeesReports(feesparams).subscribe(data => {
                try {
                    $("#divrptdailyfees").html(data._body);
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
            window.open(Common.getReportUrl("getFeesReports", feesparams));
        }
    }
}