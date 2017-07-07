import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptdailyatt.comp.html',
    providers: [MenuService, ReportsService, CommonService]
})

export class DailyAttendanceReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    attColumn: any = [];
    attData: any = [];

    actviewrights: string = "";

    @ViewChild('dailyatt') dailyatt: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.viewAttendanceReportsRights();
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

    getDefaultMonth() {
        let date = new Date();
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let mname = monthNames[date.getMonth()] + "-" + date.getFullYear().toString().substr(-2);

        return mname;
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.attData, 'DailyAttendance', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.dailyatt.nativeElement, 0, 0, options, () => {
            pdf.save("DailyAttendance.pdf");
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
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);

        this.getAttendanceReports();
    }

    public viewAttendanceReportsRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "mcode": "rptdailyatt", "utype": that.loginUser.utype
        }).subscribe(data => {
            viewRights = data.data.filter(a => a.mrights === "view");
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                this.enttid = parseInt(Cookie.get('_enttid_'));
                this.enttname = Cookie.get('_enttnm_');

                that.getAttendanceReports();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getAttendanceReports() {
        var that = this;
        var monthname = that.getDefaultMonth();

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rptservice.getAttendanceReports({
                "flag": "daily", "monthname": monthname, "schoolid": that.enttid
            }).subscribe(data => {
                try {
                    that.attData = data.data;
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
