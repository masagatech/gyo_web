import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeavePassengerService } from '@services/master';

@Component({
    templateUrl: 'viewlvpsngr.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewLeavePassengerComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    lvpsngrDT: any = [];

    private events: any[];
    private header: any;
    private event: MyEvent;
    private defaultDate: string = "";

    isShowGrid: any = true;
    isShowCalendar: any = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _lvpsngrservice: LeavePassengerService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getLeavePassenger();
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

    getLeavePassenger() {
        var that = this;
        commonfun.loader();

        that._lvpsngrservice.getLeavePassenger({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "schid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid
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

    public addLeavePassenger() {
        this._router.navigate(['/master/leavepassenger/add']);
    }

    public editLeavePassenger(row) {
        this._router.navigate(['/master/leavepassenger/edit', row.slid]);
    }
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}