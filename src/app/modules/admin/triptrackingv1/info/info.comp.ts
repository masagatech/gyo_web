import { Component, OnInit, Input } from '@angular/core';
import { TTMapService } from '@services/master';
import { MessageService, messageType, TrackDashbord } from '@services';

@Component({
    templateUrl: './info.comp.html'
})

export class INFOComponent implements OnInit {
    @Input() data: any;
    tripDT: any = [];
    vhinfo: any = {};

    constructor(private _msg: MessageService, private _ttmapservice: TTMapService, private _trackDashbord: TrackDashbord) { }

    ngOnInit() {
        this.getTripData();
    }

    // Get Today's Trip

    private getTripData() {
        var that = this;

        that._ttmapservice.getTripData({
            "flag": "vh",
            "vehid": that.data.vhid,
            "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype,
            "issysadmin": that.data.loginUser.issysadmin,
            "wsautoid": that.data._enttdetails.wsautoid
        }).subscribe(data => {
            that.tripDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }

    getVHInfo() {
        var that = this;

        if (that.vhinfo.vhid !== undefined) { return; }
        
        commonfun.loader("#loaderbody");
        
        that._trackDashbord.gettrackboard({
            "flag": "vehicleid",
            "vehid": that.data.vhid,
            "uid": that.data.loginUser.uid,
            "utype": that.data.loginUser.utype,
            "issysadmin": that.data.loginUser.issysadmin,
            "wsautoid": that.data._enttdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.vhinfo = data.data[0];
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {

        })
    }
}