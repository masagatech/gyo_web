import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './vehdb.comp.html'
})

export class VehicleDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    flag: string = "";
    qsid: number = 0;

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
        var vehdata = { "flag": "vehicle", "id": event.value };
        Cookie.set("_vehdata_", JSON.stringify(vehdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: { "flag": "vehicle", "id": event.vehid }
        });
    }

    viewVehicleDashboard() {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";
            that.qsid = params['id'] || 0;

            that.getDashboard();
            that.getVehicleTrips("html");
        });
    }

    viewStudentDashboard(row) {
        var studdata = { "flag": "student", "id": row.stdid };
        Cookie.set("_studdata_", JSON.stringify(studdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: studdata
        });
    }

    viewUserDashboard(row) {
        if (row.utype == "driver") {
            var drvdata = { "flag": "driver", "id": row.uid }
            Cookie.set("_drvdata_", JSON.stringify(drvdata));
    
            this._router.navigate(['/admin/helpdesk'], {
                queryParams: drvdata
            });
        }
        else if (row.utype == "emp") {
            var empdata = { "flag": "employee", "id": row.uid }
            Cookie.set("_empdata_", JSON.stringify(empdata));
    
            this._router.navigate(['/admin/helpdesk'], {
                queryParams: empdata
            });
        }
        else {
            var userdata = { "flag": "user", "id": row.uid }
            Cookie.set("_userdata_", JSON.stringify(userdata));
    
            this._router.navigate(['/admin/helpdesk'], {
                queryParams: { "flag": "user", "id": row.uid }
            });
        }
    }

    viewDriverDashboard(row) {
        var drvdata = { "flag": "driver", "id": row.driverid };
        Cookie.set("_drvdata_", JSON.stringify(drvdata));

        this._router.navigate(['/admin/helpdesk'], {
            queryParams: drvdata
        });
    }

    getDashboard() {
        var that = this;

        var dbparams = {
            "flag": that.flag, "vehid": that.qsid, "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                that.infoDT = data.data[0];

                if (that.infoDT.length > 0) {
                    that.autoid = that.infoDT[0].autoid;
                    that.vehid = that.infoDT[0].vehid;
                    that.vehname = that.infoDT[0].vehicleno + " : " + that.infoDT[0].imei + " (" + that.infoDT[0].ownenttname + ")";
                    that.selectVehicle = { value: that.vehid, label: that.vehname }
                }
                else {
                    that.autoid = 0;
                    that.vehid = 0;
                    that.vehname = "";
                    that.selectVehicle = {}
                }

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