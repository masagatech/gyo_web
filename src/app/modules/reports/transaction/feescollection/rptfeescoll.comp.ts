import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'rptfeescoll.comp.html'
})

export class FeesCollectionReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    schoolDT: any = [];
    enttid: number = 0;

    ayDT: any = [];
    ayid: number = 0;

    rpttype: string = "summary";

    frmdt: string = "";
    todt: string = "";

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
        this.fillSchoolDropDown();
        this.setFromDateAndToDate();

        this.classSettings = {
            singleSelection: false,
            text: "Select Class",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All Class',
            enableSearchFilter: true,
            classes: "myclass custom-class"
        };

        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
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

    // Fill School Drop Down

    fillSchoolDropDown() {
        var that = this;
        var defschoolDT: any = [];

        that.selectedClass = [];

        commonfun.loader();

        that._feesservice.getFeesStructure({
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

                    that.fillAYAndClassDropDown();
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

    // Fill Academic Year And Class Drop Down

    fillAYAndClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesrptservice.getFeesReports({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = JSON.parse(data._body).data[0];

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = 0;
                        }
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
        else if (that.selectedClass.length == 0) {
            that._msg.Show(messageType.warn, "Warning", "Select Class");
        }
        else {
            if (format == "html") {
                var feesparams = {
                    "flag": "classwise", "type": "", "frmdt": that.frmdt, "todt": that.todt, "rpttype": that.rpttype,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "ayid": that.ayid,
                    "filterClass": that.selectedClass, "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid,
                    "issysadmin": that.loginUser.issysadmin, "format": format
                }

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
                var feesparams = {
                    "flag": "classwise", "type": "download", "frmdt": that.frmdt, "todt": that.todt, "rpttype": that.rpttype,
                    "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "ayid": that.ayid,
                    "filterClass": that.selectedClass, "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid,
                    "issysadmin": that.loginUser.issysadmin, "format": format
                }

                window.open(Common.getReportUrl("getFeesReports", feesparams));
            }
        }
    }

    // Get Fees Reports

    getStudentWiseFees(row, feestype) {
        var that = this;

        var feesparams = {
            "flag": "classwise", "rpttype": "student", "vwtype": that.rpttype, "ayid": that.ayid, "stdid": "0",
            "filterClass": row.fltrclass, "studid": 0, "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid,
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
            _totpaidfees += parseFloat(this.studentFeesDT[i].paidfees);
        }

        return _totpaidfees;
    }

    totalPendingFees() {
        var _totpendfees = 0;

        for (var i = 0; i < this.studentFeesDT.length; i++) {
            _totpendfees += parseFloat(this.studentFeesDT[i].pendfees);
        }

        return _totpendfees;
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
