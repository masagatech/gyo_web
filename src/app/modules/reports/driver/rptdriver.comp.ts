import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { DriverService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptdriver.comp.html',
    providers: [MenuService, CommonService]
})

export class DriverReportsComponent implements OnInit, OnDestroy {
    driverDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    @ViewChild('driver') driver: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _driverservice: DriverService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewDriverDataRights();
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
        new Angular2Csv(this.driverDT, 'DriverReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.driver.nativeElement, 0, 0, options, () => {
            pdf.save("DriverReports.pdf");
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

        this.getDriverDetails();
    }

    public viewDriverDataRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.entityid = parseInt(Cookie.get('_enttid_'));
            that.entityname = Cookie.get('_enttnm_');
            that.getDriverDetails();
        }
    }

    getDriverDetails() {
        var that = this;
        commonfun.loader();

        that._driverservice.getDriverDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that.entityid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.driverDT = data.data;
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
