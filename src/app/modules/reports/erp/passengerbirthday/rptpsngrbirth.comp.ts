import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'rptpsngrbirth.comp.html',
    providers: [CommonService]
})

export class PassengerBirthdayComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    psngrtype: any = "";
    psngrtypenm: any = "";

    classDT: any = [];
    classid: number = 0;

    autoPassengerDT: any = [];
    selectedPassenger: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    frmdt: any = "";
    todt: any = "";

    frmday: number = 0;
    today: number = 0;
    frmmonth: number = 0;
    tomonth: number = 0;

    birthdayDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _psngrservice: PassengerService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.setFromDateAndToDate();
        this.getBirthdayList();
    }

    public ngOnInit() {

    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": this.psngrtype,
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoPassengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected passenger

    selectPassengerData(event) {
        this.psngrid = event.value;
        this.psngrname = event.label;

        this.getBirthdayList();
    }

    // Fill Standard DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._psngrservice.getPassengerReports({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data.filter(a => a.group === "class");
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

    getBirthdayList() {
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
                }
                else {
                    that.psngrtypenm = 'Employee';
                }
            }
            else {
                that.psngrtype = "passenger";
                that.psngrtypenm = "Passenger";
            }

            params = {
                "flag": "birthday", "psngrtype": that.psngrtype, "classid": that.classid, "psngrid": that.psngrid,
                "frmday": that.frmday, "frmmonth": that.frmmonth, "today": that.today, "tomonth": that.tomonth,
                "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "issysadmin": that.loginUser.issysadmin
            }

            that._psngrservice.getPassengerReports(params).subscribe(data => {
                try {
                    that.birthdayDT = data.data;
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
        });
    }

    resetBirthdayList() {
        this.classid = 0;
        this.selectedPassenger = {};
        this.psngrid = 0;
        this.psngrname = "";
        this.setFromDateAndToDate();
        this.getBirthdayList();
    }
}
