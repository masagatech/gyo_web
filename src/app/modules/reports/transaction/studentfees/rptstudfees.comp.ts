import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesReportsService } from '@services/reports';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var google: any;

@Component({
    templateUrl: 'rptstudfees.comp.html'
})

export class StudentFeesReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    classDT: IMultiSelectOption[];
    classids: number[];

    studentDT: any = [];
    studid: number = 0;
    studname: string = "";

    frmdt: string = "";
    todt: string = "";

    constructor(private _router: Router, private _routeParams: ActivatedRoute, private _msg: MessageService,
        private _loginservice: LoginService, private _feesrptservice: FeesReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
        this.setFromDateAndToDate();
    }

    public ngOnInit() {

    }

    // Fill Academic Year, Class

    fillClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesrptservice.getFeesReports({
            "flag": "classddl", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = JSON.parse(data._body).data[0];
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

    onChange() {
        console.log(this.classids);
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

    // Get Fees Reports

    getFeesReports() {
        var that = this;
        commonfun.loader();

        var feesparams = {
            "flag": "studentwise", "typ": "ledger", "stdid": 0, "classid": that.classids, "studid": that.studid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "format": "html"
        }

        that._feesrptservice.getFeesReports(feesparams).subscribe(data => {
            try {
                $("#divrptstudfees").html(data._body);
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
}
