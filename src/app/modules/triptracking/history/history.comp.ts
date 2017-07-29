import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType } from '@services';

@Component({
    templateUrl: './history.comp.html'
})
export class HISTORYComponent implements OnInit, OnDestroy {
    @Input() data: any;
    tripDT: any = [];
    dateValue: any;

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService) { }

    ngOnInit() {
        commonfun.loaderhide("#loaderbody");
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

    ngOnDestroy() {

    }
}