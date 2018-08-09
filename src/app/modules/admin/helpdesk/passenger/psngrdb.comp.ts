import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './psngrdb.comp.html'
})

export class PassengerDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    autoPassengerDT: any = [];
    selectPassenger: any = {};
    psngrid: number = 0;
    psngrname: string = "";

    infoDT: any = [];
    feesDT: any = [];
    scheduleDT: any = [];
    notificationDT: any = [];

    constructor(private _router: Router, private _msg: MessageService, private _dbservice: DashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewPassengerDashboard();
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "enttid": 0,
            "wsautoid": 0,
            "issysadmin": this.data._enttdetails.issysadmin,
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
        this.psngrname = event.label;

        Cookie.set("_psngrid_", this.psngrid.toString());
        Cookie.set("_psngrname_", this.psngrname);

        this.viewPassengerDashboard();
    }

    public viewPassengerDashboard() {
        var that = this;

        if (Cookie.get('_psngrname_') != null) {
            that.psngrid = parseInt(Cookie.get('_psngrid_'));
            that.psngrname = Cookie.get('_psngrname_');

            that.selectPassenger = { value: that.psngrid, label: that.psngrname }
        }

        that.getDashboard("passenger", "info");
        that.getDashboard("passenger", "fees");
        that.getDashboard("passenger", "notification");
        that.getDashboard("schedule", "passenger");

        that.getStudentTrips("html");
    }

    getDashboard(flag, type) {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": flag, "type": type, "psngrid": that.psngrid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                if (flag == "passenger") {
                    if (type == "info") {
                        that.infoDT = data.data;
                    }
                    else if (type == "fees") {
                        that.feesDT = data.data;
                    }
                    else if (type == "notification") {
                        that.notificationDT = data.data;
                    }
                }
                else if (flag == "schedule") {
                    that.scheduleDT = data.data;
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

    // Get Student Trips

    getStudentTrips(format) {
        var that = this;

        commonfun.loader();

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.psngrid, "utype": "passenger", "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }

        commonfun.loaderhide();
    }

    // View Passenger Profile Link

    viewPassengerProfile() {
        if (this.data._enttdetails.psngrtype == "Passenger") {
            this._router.navigate(['/master/passenger/details', this.psngrid]);
        }
        else {
            this._router.navigate(['/erp/student/details', this.psngrid]);
        }
    }

    ngOnDestroy() {

    }
}