import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeaveService } from '@services/erp';

@Component({
    templateUrl: 'viewlv.comp.html',
    providers: [CommonService]
})

export class ViewLeaveComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    lvfor: string = "emp";
    lvpsngrDT: any = [];

    passengerDT: any = [];
    psngrdata: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    status: number = -1;

    private events: any[];
    private header: any;
    private event: MyEvent;
    private defaultDate: string = "";

    isShowGrid: any = true;
    isShowCalendar: any = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _lvservice: LeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getLeaveDetails();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": this.lvfor == "emp" ? "employee" : "passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event, arg) {
        var that = this;

        that.psngrid = event.value;
        that.psngrname = event.label;
    }

    // Get Passenger Leave

    getLeaveDetails() {
        var that = this;
        commonfun.loader();

        that._lvservice.getLeaveDetails({
            "flag": this.lvfor == "emp" ? "employee" : "passenger", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype, "psngrid": that.psngrid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin, "status": that.status
        }).subscribe(data => {
            try {
                that.lvpsngrDT = data.data;
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

    // Reset Passenger Leave Reports

    resetLeaveDetails() {
        this.psngrid = 0;
        this.psngrname = "";
        this.psngrdata = [];
        this.status = -1;

        this.getLeaveDetails();
    }

    public addLeaveDetails() {
        this._router.navigate(['/leave/add']);
    }

    public editLeaveDetails(row) {
        this._router.navigate(['/leave/edit', row.lvid]);
    }

    public openLeaveApproval(row) {
        this._router.navigate(['/leave/approval', row.key.split(':')[0]]);
    }
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}