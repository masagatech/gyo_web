import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

@Component({
    templateUrl: 'rptpsngrleft.comp.html'
})

export class PassengerLeftReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    psngrtype: any = "";
    psngrtypenm: any = "";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    birthmonthDT: any = [];
    birthmonth: number = 0;

    frmdt: any = "";
    todt: any = "";

    frmday: number = 0;
    today: number = 0;
    frmmonth: number = 0;
    tomonth: number = 0;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _admsnservice: AdmissionService, private _psngrrptservice: PassengerReportsService) {
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

    // Fill Standard DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                        that.getLeftPassenger("html");
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data.filter(a => a.group === "class");
                that.birthmonthDT = data.data.filter(a => a.group === "month");
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
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var after15days = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15);

        this.frmdt = this.formatDate(today);
        this.todt = this.formatDate(after15days);

        var _frmdt = this.frmdt.split('-');
        var _todt = this.todt.split('-');

        this.frmday = _frmdt[2];
        this.frmmonth = _frmdt[1];
        this.today = _todt[2];
        this.tomonth = _todt[1];
    }

    getLeftPassenger(format) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];

                if (that.psngrtype == "student") {
                    that.psngrtypenm = 'Student';
                }
                else if (that.psngrtype == "teacher") {
                    that.psngrtypenm = 'Teacher';
                    that.classid = 0;
                }
                else {
                    that.psngrtypenm = 'Employee';
                    that.classid = 0;
                }
            }
            else {
                that.psngrtype = "passenger";
                that.psngrtypenm = "Passenger";
                that.classid = 0;
            }

            that.downloadPassengerBirthday(format);
        });
    }

    // Download Reports In Excel And PDF

    public downloadPassengerBirthday(format) {
        var that = this;

        var _frmdt = this.frmdt.split('-');
        var _todt = this.todt.split('-');

        this.frmday = _frmdt[2];
        this.frmmonth = _frmdt[1];
        this.today = _todt[2];
        this.tomonth = _todt[1];

        var dparams = {
            "flag": "left", "psngrtype": that.psngrtype, "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._psngrrptservice.getPassengerReports(dparams).subscribe(data => {
                try {
                    $("#divrptleftstud").html(data._body);
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
            window.open(Common.getReportUrl("getPassengerReports", dparams));
            commonfun.loaderhide();
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
