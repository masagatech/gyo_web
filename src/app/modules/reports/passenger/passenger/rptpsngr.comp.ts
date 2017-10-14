import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rptpsngr.comp.html',
    providers: [CommonService]
})

export class PassengerReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    doc = new jsPDF();

    specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };

    classDT: any = [];
    classid: number = 0;

    autoPassengerDT: any = [];
    psngrid: number = 0;
    psngrname: any = [];

    passengerDT: any = [];

    @ViewChild('passenger') passenger: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrservice: PassengerService) {
        this.loginUser = this._loginservice.getUser();
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
        this._autoservice.exportToCSV(this.passengerDT, "Passenger Details");
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

        that._psngrservice.getPassengerDetails({
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

    // View Data Rights

    public viewPassengerDataRights() {
        var that = this;

        if (Cookie.get('_psngrnm_') != null) {
            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrnm_');
        }

        that.getPassengerDetails();
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
            "enttid": that._enttdetails.enttid, "psngrid": that.psngrid.toString() == "" ? 0 : that.psngrid, "classid": that.classid,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
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
