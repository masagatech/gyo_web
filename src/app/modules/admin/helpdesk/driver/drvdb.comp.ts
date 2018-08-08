import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './drvdb.comp.html'
})

export class DriverDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    autoDriverDT: any = [];
    selectDriver: any = {};
    drvid: number = 0;
    drvname: string = "";

    infoDT: any = [];
    vehicleDT: any = [];

    constructor(private _router: Router, private _msg: MessageService, private _dbservice: DashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewDriverDashboard();
    }

    // Auto Completed Driver

    getDriverData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "alldriver",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data._enttdetails.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoDriverDT = data.data;
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
        Cookie.set("_drvname_", this.drvname);

        this.viewDriverDashboard();
    }

    public viewDriverDashboard() {
        var that = this;

        if (Cookie.get('_drvname_') != null) {
            that.drvid = parseInt(Cookie.get('_drvid_'));
            that.drvname = Cookie.get('_drvname_');

            that.selectDriver = { value: that.drvid, label: that.drvname }
        }

        that.getDashboard("info");
        that.getDashboard("vehicle");
        that.getDriverTrips("html");
    }

    getDashboard(type) {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": "driver", "type": type, "drvid": that.drvid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                if (type == "info") {
                    that.infoDT = data.data;
                }
                else if (type == "vehicle") {
                    that.vehicleDT = data.data;
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

    // Get Driver Trips

    getDriverTrips(format) {
        var that = this;

        commonfun.loader();

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.drvid, "utype": "driver", "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }

        commonfun.loaderhide();
    }

    // View Driver Profile Link

    viewDriverProfile() {
        this._router.navigate(['/transport/driver/details', this.drvid]);
    }

    ngOnDestroy() {

    }
}