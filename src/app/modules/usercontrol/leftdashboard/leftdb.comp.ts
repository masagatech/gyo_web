import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, LoginService, AuthenticationService } from '@services';
import { DashboardService } from '@services';
import { LoginUserModel, Globals } from '@models';

declare var $: any;

@Component({
    selector: '<leftdashboard></leftdashboard>',
    templateUrl: 'leftdb.comp.html'
})

export class LeftDashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    ufullname: string = "";
    utype: string = "";
    uphoto: string = "";
    gender: string = "";
    wsname: string = "";

    dashboardDT: any = [];

    constructor(private _router: Router, private _msg: MessageService, private _authservice: AuthenticationService,
        private _loginservice: LoginService, private _dbservice: DashboardService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.ufullname = this.loginUser.fullname;
        this.utype = this.loginUser.utype;
        this.gender = this.loginUser.gndrkey;
        this.uphoto = this.global.uploadurl + this.loginUser.uphoto;
        this.wsname = this.loginUser.wsname;

        this.getDashboard();
    }

    ngOnInit() {

    }

    // Dashboard

    getDashboard() {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid, "dbview": "ws"
        }

        that._dbservice.getDashboard(dbparams).subscribe(data => {
            try {
                that.dashboardDT = data.data;
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

    // open

    openForm(row) {
        var that = this;

        if (row.dbtype == "user") {
            sessionStorage.removeItem('_srcutype_');
            sessionStorage.setItem("_srcutype_", row.dbcode);
        }

        that._router.navigate([row.dblink]);
    }

    logout() {
        this._authservice.logout();
    }

    ngOnDestroy() {

    }
}