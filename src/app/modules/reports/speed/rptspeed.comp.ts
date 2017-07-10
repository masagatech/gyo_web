import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptspeed.comp.html',
    providers: [MenuService, CommonService]
})

export class SpeedReportsComponent implements OnInit, OnDestroy {
    speedDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    viewedon: string = "30";

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    driverDT: any = [];
    drvid: number = 0;
    drvname: string = "";

    @ViewChild('speed') speed: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rptservice: ReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewSpeedDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.speedDT, 'speedReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.speed.nativeElement, 0, 0, options, () => {
            pdf.save("speedReports.pdf");
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

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);

        this.getDriverData(event);
        this.getSpeedVialationReports();
    }

    // Auto Completed Driver

    getDriverData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "driver",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "enttid": this.enttid,
            "search": query
        }).subscribe((data) => {
            this.driverDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Driver

    selectDriverData(event) {
        this.drvid = event.value;
        this.drvname = event.label;

        Cookie.set("_drvid_", this.drvid.toString());
        Cookie.set("_drvnm_", this.drvname);

        this.getSpeedVialationReports();
    }

    public viewSpeedDataRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname = Cookie.get('_enttnm_');

            that.drvid = Cookie.get('_drvid_') == undefined ? 0 : parseInt(Cookie.get('_drvid_'));
            that.drvname = Cookie.get('_devnm_');

            that.getSpeedVialationReports();
        }
    }

    getSpeedVialationReports() {
        var that = this;
        var params = {};

        commonfun.loader();
        params = { "flag": "all", "viewedon": that.viewedon, "enttid": that.enttid, "drvid": that.drvid }

        that._rptservice.getSpeedVialationReports(params).subscribe(data => {
            try {
                that.speedDT = data.data;
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}