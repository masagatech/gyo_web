import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';

@Component({
    templateUrl: './vehdb.comp.html'
})

export class VehicleDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    flag: string = "";

    autoVehicleDT: any = [];
    selectVehicle: any = {};
    autoid: number = 0;
    vehid: number = 0;
    vehname: string = "";

    infoDT: any = [];
    userDT: any = [];
    scheduleDT: any = [];

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _msg: MessageService,
        private _dbservice: DashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewVehicleDashboard();
    }

    // Auto Completed Vehicle

    getVehicleData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "allvehicle",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data._enttdetails.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoVehicleDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Vehicle

    selectVehicleData(event) {
        this.autoid = event.value;
        this.vehid = event.vehid;
        this.vehname = event.label;

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "vehicle", "autoid": this.autoid, "vehid": this.vehid, "vehname": this.vehname }
        });
    }

    viewVehicleDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.autoid = params['autoid'] || 0;
            that.vehid = params['vehid'] || 0;
            that.vehname = params['vehname'] || "";

            that.selectVehicle = { value: that.vehid, label: that.vehname }

            that.getDashboard();
            that.getVehicleTrips("html");
        });
    }

    viewPassengerDashboard(row) {
        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "passenger", "psngrid": row.stdid, "psngrname": row.stdnm }
        });
    }

    viewUserDashboard(row) {
        if (row.utype == "driver") {
            this._router.navigate(['/admin/helpdesk'], {
                queryParams: { "flag": "driver", "drvid": row.uid, "drvname": row.fullname }
            });
        }
        else if (row.utype == "emp") {
            this._router.navigate(['/admin/helpdesk'], {
                queryParams: { "flag": "employee", "empid": row.uid, "drvname": row.fullname }
            });
        }
        else {
            this._router.navigate(['/admin/helpdesk'], {
                queryParams: { "flag": "user", "empid": row.uid, "drvname": row.fullname }
            });
        }
    }

    viewDriverDashboard(row, type) {
        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "driver", "drvid": row.driverid, "drvname": row.drivername }
        });
    }

    getDashboard() {
        var that = this;

        var dbparams = {
            "flag": that.flag, "vehid": that.vehid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];
                that.userDT = data.data[1];
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

    // Get Vehicle Trips

    getVehicleTrips(format) {
        var that = this;

        var params = {
            "flag": "feessummary", "type": "download", "uid": that.vehid, "utype": that.flag, "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }
    }

    // View Vehicle Profile Link

    viewVehicleProfile() {
        this._router.navigate(['/transport/vehicle/details', this.autoid]);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}