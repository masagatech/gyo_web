import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { FeesService } from '@services/erp';
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

    feesCollectionDT: any = [];
    totalFeesDT: any = [];
    totpaidfees: any = 0;
    totpendfees: any = 0;

    selectedType: string = "";
    studentFeesDT: any = [];

    constructor(private _router: Router, private _routeParams: ActivatedRoute, private _msg: MessageService,
        private _loginservice: LoginService, private _feesservice: FeesService, private _feesrptservice: FeesReportsService,
        private _autoservice: CommonService) {
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

    // Get Fees Reports

    getFeesReports(format) {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.warn, "Warning", "Select Academic Year");
        }
        else {
            var feesparams = {
                "flag": "classwise", "rpttype": that.rpttype, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "ctype": that.loginUser.ctype, "ayid": that.ayid, "filterClass": that.selectedClass, "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
            }

            if (format == "html") {
                commonfun.loader();

                that._feesrptservice.getFeesReports(feesparams).subscribe(data => {
                    try {
                        that.feesCollectionDT = JSON.parse(data._body).data[0];
                        that.totalFeesDT = JSON.parse(data._body).data[1];

                        if (that.totalFeesDT.length > 0) {
                            that.totpaidfees = that.totalFeesDT[0].paidfees;
                            that.totpendfees = that.totalFeesDT[0].pendfees;
                        }
                        else {
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

    // Get Fees Reports

    getStudentWiseFees(row, feestype) {
        var that = this;

        var feesparams = {
            "flag": "feesdetails", "rpttype": that.rpttype, "ayid": that.ayid, "stdid": "0", "classid": row.classid,
            "studid": 0, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "feestype": feestype,
            "catid": row.catid, "scatid": row.scatid, "isschlogo": false
        }

        commonfun.loader();

        that._feesservice.getFeesReports(feesparams).subscribe(data => {
            try {
                that.studentFeesDT = data.data[0];
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

    openStudentFeesPopup(row, feestype) {
        $("#studentFeesModal").modal('show');
        this.selectedType = feestype;
        this.getStudentWiseFees(row, feestype);
    }

    closeStudentFeesPopup() {
        $("#studentFeesModal").modal('hide');
    }

    totalPaidFees() {
        var _totpaidfees = 0;

        for (var i = 0; i < this.studentFeesDT.length; i++) {
            _totpaidfees += parseFloat(this.studentFeesDT[i].totpaidfees);
        }

        return _totpaidfees;
    }

    totalPendingFees() {
        var _totpendfees = 0;

        for (var i = 0; i < this.studentFeesDT.length; i++) {
            _totpendfees += parseFloat(this.studentFeesDT[i].totpendfees);
        }

        return _totpendfees;
    }
}
