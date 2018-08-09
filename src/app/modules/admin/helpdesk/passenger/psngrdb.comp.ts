import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';

@Component({
    templateUrl: './psngrdb.comp.html'
})

export class PassengerDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    flag: string = "";

    autoPassengerDT: any = [];
    selectPassenger: any = {};
    psngrid: number = 0;
    psngrname: string = "";

    infoDT: any = [];
    scheduleDT: any = [];
    notificationDT: any = [];

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _msg: MessageService,
        private _dbservice: DashboardService, private _autoservice: CommonService) {
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

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "passenger", "psngrid": this.psngrid, "psngrname": this.psngrname }
        });
    }

    viewPassengerDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.psngrid = params['psngrid'] || 0;
            that.psngrname = params['psngrname'] || "";

            that.selectPassenger = { value: that.psngrid, label: that.psngrname }

            that.getDashboard();
            that.getStudentTrips("html");
        });
    }

    viewDriverDashboard(row) {
        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "driver", "drvid": row.driverid, "drvname": row.drivername }
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
            "flag": that.flag == "" ? "passenger" : that.flag, "psngrid": that.psngrid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];
                that.scheduleDT = data.data[1];
                that.notificationDT = data.data[2];
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

    // Get Student Trips

    getStudentTrips(format) {
        var that = this;

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.psngrid, "utype": that.flag == "" ? "passenger" : that.flag, "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }
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
        this.subscribeParameters.unsubscribe();
    }
}