import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';

@Component({
    templateUrl: './drvdb.comp.html'
})

export class DriverDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    flag: string = "";

    autoDriverDT: any = [];
    selectDriver: any = {};
    drvid: number = 0;
    drvname: string = "";

    infoDT: any = [];
    vehicleDT: any = [];
    scheduleDT: any = [];

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _msg: MessageService,
        private _dbservice: DashboardService, private _autoservice: CommonService) {
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

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "driver", "drvid": this.drvid, "drvname": this.drvname }
        });
    }

    viewDriverDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.drvid = params['drvid'] || 0;
            that.drvname = params['drvname'] || "";

            that.selectDriver = { value: that.drvid, label: that.drvname }

            that.getDashboard();
            that.getDriverTrips("html");
        });
    }

    viewPassengerDashboard(row) {
        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "passenger", "psngrid": row.stdid, "psngrname": row.stdnm }
        });
    }

    viewVehicleDashboard(row) {
        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "vehicle", "autoid": row.vehautoid, "vehid": row.vehicleid, "vehname": row.vehregno + " - " + row.imei }
        });
    }

    getDashboard() {
        var that = this;

        var dbparams = {
            "flag": "driver", "drvid": that.drvid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];
                that.vehicleDT = data.data[1];
                that.scheduleDT = data.data[2];
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

    // Get Driver Trips

    getDriverTrips(format) {
        var that = this;

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.drvid, "utype": that.flag, "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }
    }

    // View Driver Profile Link

    viewDriverProfile() {
        this._router.navigate(['/transport/driver/details', this.drvid]);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}