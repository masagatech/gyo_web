import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Globals, Common } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './vehdb.comp.html'
})

export class VehicleDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    global = new Globals();

    autoVehicleDT: any = [];
    selectVehicle: any = {};
    autoid: number = 0;
    vehid: number = 0;
    vehname: string = "";

    infoDT: any = [];
    userDT: any = [];

    constructor(private _router: Router, private _msg: MessageService, private _dbservice: DashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewVehicleDashboard();
    }

    // Auto Completed Vehicle

    getVehicleData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "vehicle",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "enttid": this.data._enttdetails.enttid,
            "wsautoid": this.data._enttdetails.wsautoid,
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

        Cookie.set("_autoid_", this.autoid.toString());
        Cookie.set("_vehid_", this.vehid.toString());
        Cookie.set("_vehname_", this.vehname);

        this.viewVehicleDashboard();
    }

    public viewVehicleDashboard() {
        var that = this;

        if (Cookie.get('_vehname_') != null) {
            that.autoid = parseInt(Cookie.get('_autoid_'));
            that.vehid = parseInt(Cookie.get('_vehid_'));
            that.vehname = Cookie.get('_vehname_');

            that.selectVehicle = { value: that.vehid, label: that.vehname }
        }

        that.getDashboard("info");
        that.getDashboard("driver");
        that.getVehicleTrips("html");
    }

    getDashboard(type) {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": "vehicle", "type": type, "vehid": that.vehid, "ayid": that.data._enttdetails.ayid,
            "enttid": that.data._enttdetails.enttid, "wsautoid": that.data._enttdetails.wsautoid,
            "uid": that.data.loginUser.uid, "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                if (type == "info") {
                    that.infoDT = data.data;
                }
                else if (type == "driver") {
                    that.userDT = data.data;
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

    // Get Vehicle Trips

    getVehicleTrips(format) {
        var that = this;

        commonfun.loader();

        var params = {
            "flag": "feessummary", "type": "download", "vehid": that.vehid, "format": format
        }

        if (format == "html") {
            $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        }
        else {
            window.open(Common.getReportUrl("getScheduleReports", params));
        }

        commonfun.loaderhide();
    }

    // View Vehicle Profile Link

    viewVehicleProfile() {
        this._router.navigate(['/transport/vehicle/details', this.autoid]);
    }

    ngOnDestroy() {

    }
}