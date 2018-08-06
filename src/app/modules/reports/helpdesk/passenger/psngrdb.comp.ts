import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MessageService, messageType, CommonService, DashboardService } from '@services';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './psngrdb.comp.html'
})

export class PassengerDashboardComponent implements OnInit, OnDestroy {
    @Input() data: any;

    autoPassengerDT: any = [];
    selectPassenger: any = {};
    psngrid: number = 0;
    psngrname: string = "";

    infoDT: any = [];
    feesDT: any = [];
    scheduleDT: any = [];
    notificationDT: any = [];

    constructor(private _msg: MessageService, private _dbservice: DashboardService, private _autoservice: CommonService) {
    }

    ngOnInit() {
        this.viewPassengerDashboard();
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.data.loginUser.uid,
            "ucode": this.data.loginUser.ucode,
            "utype": this.data.loginUser.utype,
            "enttid": this.data._enttdetails.enttid,
            "wsautoid": this.data._enttdetails.wsautoid,
            "issysadmin": this.data._enttdetails.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoPassengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        this.psngrid = event.value;
        this.psngrname = event.label;

        Cookie.set("_psngrid_", this.psngrid.toString());
        Cookie.set("_psngrname_", this.psngrname);

        this.viewPassengerDashboard();
    }

    public viewPassengerDashboard() {
        var that = this;

        if (Cookie.get('_psngrname_') != null) {
            that.psngrid = parseInt(Cookie.get('_psngrid_'));
            that.psngrname = Cookie.get('_psngrname_');

            that.selectPassenger = { value: that.psngrid, label: that.psngrname }
        }

        that.getDashboard("info");
        that.getDashboard("fees");
        that.getDashboard("schedule");
        that.getDashboard("notification");
    }

    getDashboard(type) {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": "passenger", "type": type, "psngrid": that.psngrid, "ayid": that.data._enttdetails.ayid,
            "enttid": that.data._enttdetails.enttid, "wsautoid": that.data._enttdetails.wsautoid,
            "uid": that.data.loginUser.uid, "utype": that.data.loginUser.utype, "issysadmin": that.data.loginUser.issysadmin
        }

        that._dbservice.getHelpDesk(dbparams).subscribe(data => {
            try {
                if (type == "info") {
                    that.infoDT = data.data;
                }
                else if (type == "fees") {
                    that.feesDT = data.data;
                }
                else if (type == "schedule") {
                    that.scheduleDT = data.data;
                }
                else if (type == "notification") {
                    that.notificationDT = data.data;
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

    ngOnDestroy() {

    }
}