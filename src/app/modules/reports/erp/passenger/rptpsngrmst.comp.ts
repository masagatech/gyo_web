import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

declare var $: any;

@Component({
    templateUrl: 'rptpsngrmst.comp.html'
})

export class PassengerMasterComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    ayDT: any = [];
    admissionCategoryDT: any = [];
    prospectusDT: any = [];
    boardDT: any = [];
    classDT: any = [];
    genderDT: any = [];
    castCategoryDT: any = [];
    bloodGroupDT: any = [];
    religionDT: any = [];

    frmage: any = "";
    toage: any = "";
    ayid: number = 0;
    status: string = "";
    admcatid: string = "";
    prspctid: number = 0;
    boardid: number = 0;
    classid: number = 0;
    gender: string = "";
    castcatid: string = "";
    bldgrpid: string = "";
    relgnid: string = "";

    autoPassengerDT: any = [];
    selectedPassenger: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    psngrtype: string = "";
    psngrtypenm: any = "";

    passengerDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _autoservice: CommonService, private _admsnservice: AdmissionService, private _psngrrptservice: PassengerReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
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

        this.getPassengerReports("html");
    }

    // Fill Academic Year, Prospectus, Board, Class, Gender And Cast Category DropDown

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
                    if (sessionStorage.getItem("_ayid_") != null) {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                        
                        that.getPassengerReports("html");
                    }
                }

                that.admissionCategoryDT = data.data.filter(a => a.group == "admissioncategory");
                that.prospectusDT = data.data.filter(a => a.group == "prospectus");
                that.boardDT = data.data.filter(a => a.group == "board");
                that.classDT = data.data.filter(a => a.group == "class");
                that.genderDT = data.data.filter(a => a.group == "gender");
                that.castCategoryDT = data.data.filter(a => a.group == "castcategory");
                that.bloodGroupDT = data.data.filter(a => a.group == "bloodgroup");
                that.religionDT = data.data.filter(a => a.group == "religion");
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

    getPassengerReports(format) {
        var that = this;

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
                else if (that.psngrtype == "employee") {
                    that.psngrtypenm = 'Employee';
                    that.classid = 0;
                }
            }
            else {
                that.psngrtype = "passenger";
                that.psngrtypenm = 'Passenger';
                that.classid = 0;
            }

            that.downloadPassengerReports(format);
        });
    }

    // Download Reports In Excel And PDF

    public downloadPassengerReports(format) {
        var that = this;
        var _flag = "";

        if (that.psngrtype == "student") {
            _flag = "student";
        }
        else {
            _flag = "profile";
        }

        var dparams = {
            "flag": _flag, "psngrtype": that.psngrtype, "psngrid": that.psngrid.toString() == "" ? 0 : that.psngrid,
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "ayid": that.ayid,
            "status": that.status, "admcatid": that.admcatid, "prspctid": that.prspctid, "boardid": that.boardid, "classid": that.classid,
            "gndrkey": that.gender, "castcatid": that.castcatid, "bldgrpid": that.bldgrpid, "relgnid": that.relgnid,
            "frmage": that.frmage, "toage": that.toage == "" ? that.frmage : that.toage,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._psngrrptservice.getPassengerReports(dparams).subscribe(data => {
                try {
                    $("#divrptpsngr").html(data._body);
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

    // Reset Passenger Filter

    resetPassengerFilter() {
        this.prspctid = 0;
        this.boardid = 0;
        this.classid = 0;
        this.gender = "";
        this.castcatid = "";
        this.frmage = "";
        this.toage = ""

        this.psngrid = 0;
        this.psngrname = "";
        this.selectedPassenger = {};

        this.getPassengerReports("html");
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        
        this.subscribeParameters.unsubscribe();
    }
}
