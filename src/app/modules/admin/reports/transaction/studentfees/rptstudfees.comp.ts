import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'rptstudfees.comp.html'
})

export class StudentFeesReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    entttype: string = "";

    wsautoid: number = 0;

    rpttype: string = "clswise";

    classDT = [];
    selectedClass = [];
    classSettings = {};
    classIDs: string = "";

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
    }

    public ngOnInit() {
        this.fillSchoolDropDown();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);

        this.classSettings = {
            singleSelection: false,
            text: "Select Class",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All Class',
            enableSearchFilter: true,
            classes: "myclass custom-class"
        };
    }

    // Fill School Drop Down

    fillSchoolDropDown() {
        var that = this;
        var defschoolDT: any = [];

        commonfun.loader();

        that._autoservice.getDropDownData({
            "flag": "school", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that.loginUser.issysadmin ? 0 : that.loginUser.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.entityDT = data.data;

                if (that.entityDT.length > 0) {
                    defschoolDT = that.entityDT.filter(a => a.iscurrent == true);

                    if (defschoolDT.length > 0) {
                        that.enttid = defschoolDT[0].enttid;
                    }
                    else {
                        if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
                            that.enttid = 0;
                            that.wsautoid = 0;
                        }
                        else {
                            that.enttid = that._enttdetails.enttid;
                            that.wsautoid = that._enttdetails.wsautoid;
                        }
                    }

                    that.fillClassDropDown();
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

    // Fill Class

    fillClassDropDown() {
        var that = this;

        commonfun.loader();

        that._feesrptservice.getFeesReports({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that.enttid, "wsautoid": that.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = JSON.parse(data._body).data[1];
                that.getDefaultFiledsByEntity();
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

    // Get Default Fields By Entity

    getDefaultFiledsByEntity() {
        var that = this;

        commonfun.loader();

        that._autoservice.getDropDownData({
            "flag": "byentt", "enttid": that.enttid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.entttype = data.data[0].entttype;

                    if (that.entttype == "School") {
                        that.rpttype = "clswise";
                    }
                    else {
                        that.rpttype = "studwise";
                    }

                    that.selectedClass = data.data[0].filterClass;
                    that.getFeesReports("html");
                }
                else {
                    that.entttype = "";
                    that.selectedClass = [];
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
            "wsautoid": that.wsautoid,
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

    isValidReports() {
        var that = this;

        if (that.entttype == "School") {
            if (that.rpttype == "clswise") {
                if (that.selectedClass.length == 0) {
                    that._msg.Show(messageType.warn, "Warning", "Select Class");
                    return false;
                }
            }

            if (that.rpttype == "studwise") {
                if (that.studid == 0) {
                    that._msg.Show(messageType.warn, "Warning", "Enter Student");
                    return false;
                }
            }
        }

        return true;
    }

    getFeesReports(format) {
        var that = this;
        var isvalid: boolean = false;
        var feesparams = {};

        isvalid = that.isValidReports();

        if (isvalid) {
            if (that.rpttype == "clswise") {
                that.studid = 0;

                feesparams = {
                    "flag": "studentwise", "type": "download", "rpttype": "view", "ayid": 0, "stdid": 0, "filterClass": that.selectedClass,
                    "studid": that.studid, "frmdt": that.frmdt, "todt": that.todt, "enttid": that.enttid,
                    "wsautoid": that.wsautoid, "isschlogo": format == "pdf" ? true : false, "format": format
                }
            }
            else {
                that.selectedClass = [];

                feesparams = {
                    "flag": "studentwise", "type": "download", "rpttype": "view", "ayid": 0, "stdid": 0,
                    "studid": that.studid, "frmdt": that.frmdt, "todt": that.todt, "enttid": that.enttid,
                    "wsautoid": that.wsautoid, "isschlogo": format == "pdf" ? true : false, "format": format
                }
            }

            if (format == "html") {
                commonfun.loader();

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
            else {
                window.open(Common.getReportUrl("getFeesReports", feesparams));
            }
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
