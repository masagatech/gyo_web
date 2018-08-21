import { Component, OnInit, Input } from '@angular/core';
import { Globals, Common } from '@models';

@Component({
    selector: 'schedule',
    templateUrl: './vehschdl.comp.html'
})

export class VehicleScheduleComponent implements OnInit {
    @Input() data: any;
    @Input() isload: any;

    psngrDT: any = [];
    global = new Globals();

    constructor() {

    }

    ngOnInit() {
        if (!this.isload) {
            this.getVehicleTrips(this.data.vehid);
        }
    }

    // Get Vehicle Trips

    getVehicleTrips(vehid) {
        var params = {
            "flag": "feessummary", "type": "download", "uid": vehid, "utype": "vehicle", "format": "html"
        }

        $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
        commonfun.loaderhide("#loaderbody");
    }
}