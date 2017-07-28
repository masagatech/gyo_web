import { Component, OnInit, Input } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType } from '@services';

@Component({
    templateUrl: './info.comp.html'
})
export class INFOComponent implements OnInit {
    @Input() data: any;
    tripDT: any = [];

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService) { }

    ngOnInit() {
        this.getTripData();
    }

    // Get Today's Trip

    private getTripData() {
        var that = this;
        this._ttmapservice.getTripData({ "flag": "vh", "vehid": this.data.vhid }).subscribe(data => {
            that.tripDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }

}