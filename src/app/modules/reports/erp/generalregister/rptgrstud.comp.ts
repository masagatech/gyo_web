import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

@Component({
    templateUrl: 'rptgrstud.comp.html',
    providers: [CommonService]
})

export class GeneralRegisterReportsComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    grtype: any = "";
    grtypenm: any = "";

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    autoStudentDT: any = [];
    selectedStudent: any = [];
    studid: number = 0;
    studname: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _admsnservice: AdmissionService, private _psngrrptservice: PassengerReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {

    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": this.grtype,
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoStudentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected passenger

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.getGeneralRegister("html");
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
                        that.getGeneralRegister("html");
                    }
                    else {
                        that.ayid = 0;
                    }
                }

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

    getGeneralRegister(format) {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['grtype'] !== undefined) {
                that.grtype = params['grtype'];

                if (that.grtype == "provisional") {
                    that.grtypenm = 'Provisional';
                }
                else {
                    that.grtypenm = 'Original';
                }
            }

            that.downloadGeneralRegister(format);
        });
    }

    // Download Reports In Excel And PDF

    public downloadGeneralRegister(format) {
        var that = this;

        var dparams = {
            "flag": "gr_report", "grtype": that.grtype, "studid": that.studid.toString() == "" ? 0 : that.studid,
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._psngrrptservice.getPassengerReports(dparams).subscribe(data => {
                try {
                    $("#divrptgrstud").html(data._body);
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

    resetGeneralRegister() {
        this.ayid = 0;
        this.classid = 0;
        this.selectedStudent = {};
        this.studid = 0;
        this.studname = "";
        this.getGeneralRegister("html");
    }
}
