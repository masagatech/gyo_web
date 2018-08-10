import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './drvdb.comp.html'
})

export class DriverDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    flag: string = "";
    qsid: number = 0;

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
        var drvdata = { "flag": "driver", "id": event.value };
        Cookie.set("_drvdata_", JSON.stringify(drvdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: drvdata
        });
    }

    viewDriverDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.qsid = params['id'] || 0;

            that.getDashboard();
            that.getDriverTrips("html");
        });
    }

    viewStudentDashboard(row) {
        var studdata = { "flag": "student", "id": row.stdid };
        Cookie.set("_studdata_", JSON.stringify(studdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: studdata
        });
    }

    viewVehicleDashboard(row) {
        var vehdata = { "flag": "vehicle", "id": row.vehicleid };
        Cookie.set("_vehdata_", JSON.stringify(vehdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: vehdata
        });
    }

    getDashboard() {
        var that = this;

        var dbparams = {
            "flag": that.flag, "drvid": that.qsid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];

                if (that.infoDT.length > 0) {
                    that.drvid = that.infoDT[0].driverid;
                    that.drvname = that.infoDT[0].drivername + " : " + that.infoDT[0].mobileno1 + " : " + that.infoDT[0].mobileno2 + " (" + that.infoDT[0].ownenttname + ")";
                    that.selectDriver = { value: that.drvid, label: that.drvname }
                }
                else {
                    that.drvid = 0;
                    that.drvname = "";
                    that.selectDriver = {}
                }

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
        this._router.navigate(['/transport/driver/details', this.qsid]);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}