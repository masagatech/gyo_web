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
        this._ttmapservice.getTripData({
            "flag": "vh",
            "vehid": this.data.vhid,
            "uid": this.data.loginUser.uid,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data.loginUser.issysadmin,
            "wsautoid": this.data._wsdetails.wsautoid
        }).subscribe(data => {
            that.tripDT = data.data;
            commonfun.loaderhide("#loaderbody");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loaderbody");
        }, () => {
        });
    }

    private getVHInfo() {
        if (this.vhinfo.vhid !== undefined) { return; }
        var that = this;
        commonfun.loader("#loaderbody");
        this._trackDashbord.gettrackboard({
            "flag": "vehicleid",
            "vehid": this.data.vhid,
            "uid": this.data.loginUser.uid,
            "utype": this.data.loginUser.utype,
            "issysadmin": this.data.loginUser.issysadmin,
            "wsautoid": this.data._wsdetails.wsautoid
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