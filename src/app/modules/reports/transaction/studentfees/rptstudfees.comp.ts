import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';

declare var google: any;

@Component({
    templateUrl: 'rptstudfees.comp.html'
})

export class StudentFeesReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    classDT: any = [];
    classid: number = 0;

    studentDT: any = [];
    studid: number = 0;
    studname: string = "";

    constructor(private _feesservice: FeesService, private _feesrptservice: FeesReportsService, private _routeParams: ActivatedRoute,
        private _router: Router, private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
    }

    public ngOnInit() {

    }

    // Fill Academic Year, Class

    fillClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data[0].filter(a => a.group == "class");
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

    // Get Fees Reports

    getFeesReports() {
        var that = this;
        commonfun.loader();

        var feesparams = {
            "flag": "studentwise", "typ": "ledger", "stdid": 0, "classid": that.classid, "studid": that.studid,
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
