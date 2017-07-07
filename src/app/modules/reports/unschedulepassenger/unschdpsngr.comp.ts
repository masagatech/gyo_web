import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'unschdpsngr.comp.html',
    providers: [MenuService, CommonService]
})

export class UnschedulePassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    passengerDT: any = [];
    actviewrights: string = "";

    @ViewChild('unschdpsngr') unschdpsngr: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _rptservice: ReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.viewUnscheduleReportsRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.passengerDT, 'UnscheduledPassenger', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.unschdpsngr.nativeElement, 0, 0, options, () => {
            pdf.save("UnscheduledPassenger.pdf");
        });
    }

    public viewUnscheduleReportsRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "mcode": "unschdpsngr", "utype": that.loginUser.utype
        }).subscribe(data => {
            viewRights = data.data.filter(a => a.mrights === "view");
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                that.enttid = parseInt(Cookie.get('_enttid_'));
                that.enttname = Cookie.get('_enttnm_');

                that.getUnschedulePassenger();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);

        this.getUnschedulePassenger();
    }

    // View Passenger List

    getUnschedulePassenger() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rptservice.getRouteWisePassengerReports({
                "flag": "unschedule", "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid
            }).subscribe(data => {
                try {
                    if (data.data.length > 0) {
                        that.passengerDT = data.data;
                    }
                    else {
                        that.passengerDT = [];
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
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
