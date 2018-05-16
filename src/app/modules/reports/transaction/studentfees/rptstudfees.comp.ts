import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { FeesReportsService } from '@services/reports';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var google: any;

@Component({
    templateUrl: 'rptstudfees.comp.html'
})

export class StudentFeesReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

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
        private _loginservice: LoginService, private _feesrptservice: FeesReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.fillClassDropDown();

        this.classSettings = {
            singleSelection: false,
            text: "Select Class",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All Class',
            enableSearchFilter: true,
            classes: "myclass custom-class"
        };
    }

    // Fill Academic Year, Class

    fillClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesrptservice.getFeesReports({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
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

    // Auto Completed Student

    getStudentData(event) {
        let that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "student",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
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
                    "flag": "studentwise", "rpttype": "view", "ayid": 0, "stdid": 0, "filterClass": that.selectedClass, "studid": that.studid,
                    "frmdt": that.frmdt, "todt": that.todt, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                    "isschlogo": format == "pdf" ? true : false, "format": format
                }
            }
            else{
                that.selectedClass = [];

                feesparams = {
                    "flag": "studentwise", "rpttype": "view", "ayid": 0, "stdid": 0, "studid": that.studid,
                    "frmdt": that.frmdt, "todt": that.todt, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                    "isschlogo": format == "pdf" ? true : false, "format": format
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
}
