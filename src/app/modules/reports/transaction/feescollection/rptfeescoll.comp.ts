import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { FeesReportsService } from '@services/reports';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var google: any;

@Component({
    templateUrl: 'rptfeescoll.comp.html'
})

export class FeesCollectionReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    rpttype: string = "summary";

    classDT = [];
    selectedClass = [];
    classSettings = {};
    selclsids: string = "";

    feesCollectionDT: any = [];
    totalFeesDT: any = [];
    totpaidfees: any = 0;
    totpendfees: any = 0;

    constructor(private _router: Router, private _routeParams: ActivatedRoute, private _msg: MessageService,
        private _loginservice: LoginService, private _feesrptservice: FeesReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.fillAYAndClassDropDown();

        this.classSettings = {
            singleSelection: false,
            text: "Select Class",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All Class',
            enableSearchFilter: true,
            classes: "myclass custom-class"
        };
    }

    // Fill Academic Year And Class Drop Down

    fillAYAndClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesrptservice.getFeesReports({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = JSON.parse(data._body).data[0];

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = JSON.parse(data._body).data[1];
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

    onClassSelect(row: any) {
        var _classid = "";

        for (var i = 0; i < this.selectedClass.length; i++) {
            _classid = this.selectedClass[i].id;
        }

        this.selclsids += _classid + ",";
    }

    // Get Fees Reports

    getFeesReports(format) {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.warn, "Warning", "Select Academic Year");
        }
        else {
            var feesparams = {
                "flag": "reports", "rpttype": that.rpttype, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "ctype": that.loginUser.ctype, "ayid": that.ayid, "selclsids": that.selclsids, "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
            }

            if (format == "html") {
                commonfun.loader();

                that._feesrptservice.getFeesReports(feesparams).subscribe(data => {
                    try {
                        that.feesCollectionDT = JSON.parse(data._body).data[0];
                        that.totalFeesDT = JSON.parse(data._body).data[1];

                        if(that.totalFeesDT.length > 0){
                            that.totpaidfees = that.totalFeesDT[0].paidfees;
                            that.totpendfees = that.totalFeesDT[0].pendfees;
                        }
                        else{
                            that.totpaidfees = 0;
                            that.totpendfees = 0;
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
            else {
                window.open(Common.getReportUrl("getFeesReports", feesparams));
            }
        }
    }
}
