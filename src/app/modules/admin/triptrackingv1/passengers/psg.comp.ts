import { Component, OnInit, Input } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType } from '@services';
import { Globals } from '@models';

@Component({
    selector: 'pessangers',
    templateUrl: './psg.comp.html',
    styleUrls: ['./style.css']
})

export class PSGComponent implements OnInit {
    @Input() data: any;
    @Input() isload: any;

    psngrDT: any = [];
    global = new Globals();

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService) {

    }

    ngOnInit() {
        if (!this.isload) {
            this.showPassengerList(this.data.tripid);
        }
    }

    public showPassengerList(tripid: any) {
        var that = this;

        this._ttmapservice.showPassengerList({
            "flag": "trip", "tripid": tripid
        }).subscribe(data => {
            that.psngrDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }
}