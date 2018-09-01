import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Globals, Common } from '@models';

@Component({
    selector: 'schedule',
    templateUrl: './vehschdl.comp.html'
})

export class VehicleScheduleComponent implements OnInit, AfterViewInit {
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
    
    ngAfterViewInit() {
        // $('#divtrip').on('', function () {
        //     commonfun.loaderhide("#loaderbody");
        // });
        document.getElementById('divtrip').onload = function () {
            commonfun.loaderhide("#loaderbody");
        };
    }

    // Get Vehicle Trips

    getVehicleTrips(vehid) {
        var params = {
            "flag": "feessummary", "type": "download", "uid": vehid, "utype": "vehicle", "format": "html"
        }

        $("#divtrip")[0].src = Common.getReportUrl("getScheduleReports", params);
    }
}