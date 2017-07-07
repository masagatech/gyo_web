import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { RouteService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptroute.comp.html',
    providers: [CommonService, MenuService]
})

export class RouteReportsComponent implements OnInit, OnDestroy {
    routeDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    @ViewChild('route') route: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rtservice: RouteService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewrouteDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".entityname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.routeDT, 'RouteDetails', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.route.nativeElement, 0, 0, options, () => {
            pdf.save("RouteReports.pdf");
        });
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

    // Selected Owners

    selectEntityData(event) {
        this.entityid = event.value;
        this.entityname = event.label;

        Cookie.set("_enttid_", this.entityid.toString());
        Cookie.set("_enttnm_", this.entityname);

        this.getRouteDetails();
    }

    public viewrouteDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "mcode": "veh"
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                that.entityid = parseInt(Cookie.get('_enttid_'));
                that.entityname = Cookie.get('_enttnm_');
                that.getRouteDetails();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getRouteDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rtservice.getStopsDetails({
                "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                "issysadmin": that.loginUser.issysadmin, "enttid": that.entityid, "wsautoid": that._wsdetails.wsautoid
            }).subscribe(data => {
                try {
                    that.routeDT = data.data;
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
