import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rptpsngr.comp.html',
    providers: [MenuService, CommonService]
})

export class PassengerReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    doc = new jsPDF();

    specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };

    standardDT: any = [];
    standard: string = "";

    autoPassengerDT: any = [];
    psngrid: number = 0;
    psngrname: any = [];

    passengerDT: any = [];

    @ViewChild('passenger') passenger: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrservice: PassengerService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.viewPassengerDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    public exportToCSV() {
        new Angular2Csv(this.passengerDT, 'PassengerReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.passenger.nativeElement, 0, 0, options, () => {
            pdf.save("PassengerReports.pdf");
        });

        // this.doc.fromHTML($('#passenger').get(0), 0, 0, {
        //     'width': 500,
        //     'elementHandlers': this.specialElementHandlers
        // });

        // this.doc.save('PassengerDetails.pdf');
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "id": this._enttdetails.enttid,
            "search": query
        }).subscribe((data) => {
            this.autoPassengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        this.psngrid = event.value;

        Cookie.set("_psngrid_", event.value);
        Cookie.set("_psngrnm_", event.label);

        this.getPassengerDetails();
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._psngrservice.getPassengerDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group === "standard");
                setTimeout(function () { $.AdminBSB.select.refresh('standard'); }, 100);
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

    // View Data Rights

    public viewPassengerDataRights() {
        var that = this;

        if (Cookie.get('_psngrnm_') != null) {
            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrnm_');

            that.getPassengerDetails();
        }
    }

    getPassengerDetails() {
        var that = this;
        var params = {};

        commonfun.loader("#fltrpsngr");

        if (that.psngrid == 0) {
            Cookie.set("_psngrid_", "0");
            Cookie.set("_psngrnm_", "");

            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrnm_');
        }

        params = {
            "flag": "reports", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "schid": that._enttdetails.enttid, "stdid": that.psngrid.toString() == "" ? 0 : that.psngrid, "standard": that.standard,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
        };

        that._psngrservice.getPassengerDetails(params).subscribe(data => {
            try {
                that.passengerDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#fltrpsngr");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#fltrpsngr");
        }, () => {

        })
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
