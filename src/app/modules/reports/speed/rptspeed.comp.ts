import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptspeed.comp.html',
    providers: [MenuService, CommonService]
})

export class SpeedReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    speedDT: any = [];

    viewedon: string = "30";

    driverDT: any = [];
    drvid: number = 0;
    drvname: any = [];

    speedDriverDT: any = [];

    @ViewChild('speed') speed: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rptservice: ReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

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
        this._autoservice.exportToCSV(this.speedDT, "Speed Details");
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
            "enttid": this._enttdetails.enttid,
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
        Cookie.set("_drvid_", event.value);
        Cookie.set("_drvnm_", event.label);

        this.getSpeedViolationReports();
    }

    public viewSpeedDataRights() {
        var that = this;

        if (Cookie.get('_drvnm_') != null) {
            that.drvname.value = parseInt(Cookie.get('_drvid_'));
            that.drvname.label = Cookie.get('_drvnm_');

            that.getLimitSpeedDriver();
            that.getSpeedViolationReports();
        }
    }

    getLimitSpeedDriver() {
        var that = this;
        var params = {};

        commonfun.loader();
        params = {
            "flag": "Top5", "viewedon": that.viewedon, "enttid": that._enttdetails.enttid,
            "drvid": that.drvid, "wsautoid": that._wsdetails.wsautoid
        }

        that._rptservice.getSpeedViolationReports(params).subscribe(data => {
            try {
                that.speedDriverDT = data.data;
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

    getSpeedViolationReports() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all", "viewedon": that.viewedon, "enttid": that._enttdetails.enttid,
            "drvid": that.drvid, "wsautoid": that._wsdetails.wsautoid
        }

        that._rptservice.getSpeedViolationReports(params).subscribe(data => {
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

    resetSpeedViolationReports() {
        Cookie.delete('_drvid_');
        Cookie.delete('_drvnm_');

        this.drvid = 0;
        this.drvname = [];

        this.getSpeedViolationReports();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
