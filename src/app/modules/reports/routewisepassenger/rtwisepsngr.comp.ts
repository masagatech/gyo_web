import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rtwisepsngr.comp.html',
    providers: [MenuService, CommonService]
})

export class RouteWisePassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    batchDT: any = [];
    batchid: number = 0;

    routesDT: any = [];
    stopsDT: any = [];
    passengerDT: any = [];

    rtname: string = "";
    stpname: string = "";
    batchname: string = "";

    actviewrights: string = "";

    @ViewChild('rtwisepsngr') rtwisepsngr: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _rptservice: ReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.viewRouteWisePassengerReportsRights();
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

    // Export

    public exportToCSV() {
        new Angular2Csv(this.routesDT, 'RouteWisePassenger', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.rtwisepsngr.nativeElement, 0, 0, options, () => {
            pdf.save("RouteWisePassenger.pdf");
        });
    }

    public viewRouteWisePassengerReportsRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "mcode": "rtwisepsngr", "utype": that.loginUser.utype
        }).subscribe(data => {
            viewRights = data.data.filter(a => a.mrights === "view");
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                that.enttid = parseInt(Cookie.get('_enttid_'));
                that.enttname = Cookie.get('_enttnm_');

                that.getEntityWiseRoute();
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

        this.getEntityWiseRoute();
    }

    // Batch DropDown

    fillBatchDropDown() {
        var that = this;

        that._rptservice.getRouteWisePassengerReports({
            "flag": "batch",
            "id": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.batchDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // View Route List

    getEntityWiseRoute() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rptservice.getRouteWisePassengerReports({
                "flag": "route", "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid
            }).subscribe(data => {
                try {
                    that.routesDT = data.data;
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

    // View Route List

    getRouteWiseStops(row) {
        var that = this;
        that.stopsDT = [];

        commonfun.loader("#ddlstops");

        that._rptservice.getRouteWisePassengerReports({
            "flag": "stops", "enttid": row.enttid, "rtid": row.rtid, "batchid": row.batchid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                row.stopsDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#ddlstops");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#ddlstops");
        }, () => {

        })
    }

    // View Passenger List

    getStopsWisePassenger(row) {
        var that = this;

        $("#passengerModal").modal('show');
        commonfun.loader("#passengerModal");

        that.passengerDT = [];

        that._rptservice.getRouteWisePassengerReports({
            "flag": "rtwise", "stpid": row.stpid, "enttid": row.schoolid, "rtid": row.rtid,
            "batchid": row.batchid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.passengerDT = data.data;
                    that.rtname = data.data[0].rtname
                    that.stpname = data.data[0].stpname;
                    that.batchname = data.data[0].batchname;
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide("#passengerModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#passengerModal");
        }, () => {

        })
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
