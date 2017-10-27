import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rptpsngrmst.comp.html',
    providers: [CommonService]
})

export class PassengerMasterComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    doc = new jsPDF();

    specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };

    classDT: any = [];
    classid: number = 0;

    autoPassengerDT: any = [];
    psngrdata: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    psngrtype: string = "";
    psngrtypenm: any = "";

    passengerDT: any = [];

    private subscribeParameters: any;

    @ViewChild('passenger') passenger: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getPassengerDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    public exportToCSV() {
        this._autoservice.exportToCSV(this.passengerDT, this.psngrtypenm + " Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.passenger.nativeElement, 0, 0, options, () => {
            pdf.save(this.psngrtypenm + " Reports.pdf");
        });
    }

    // Auto Completed Passenger

    getpassengerData(event) {
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

        this.getPassengerDetails();
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._admsnservice.getPassengerDetails({
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

    getPassengerDetails() {
        var that = this;
        var params = {};

        commonfun.loader("#fltrstud");

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

                params = {
                    "flag": that.psngrtype, "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                    "psngrid": that.psngrid.toString() == "" ? 0 : that.psngrid, "classid": that.classid,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,  "issysadmin": that.loginUser.issysadmin
                };

                that._admsnservice.getPassengerDetails(params).subscribe(data => {
                    try {
                        that.passengerDT = data.data;
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide("#fltrstud");
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                    commonfun.loaderhide("#fltrstud");
                }, () => {

                })
            }
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
