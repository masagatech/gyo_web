import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { InventoryService } from '@services/master';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'dashboard.comp.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    dashboardDT: any = [];

    constructor(private _loginservice: LoginService, private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _invservice: InventoryService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getDashboard();
    }

    ngOnInit() {

    }

    // Dashboard

    getDashboard() {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "flag": "dashboard", "wsautoid": that._wsdetails.wsautoid
        }

        that._invservice.getDeiviceSimMapping(dbparams).subscribe(data => {
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

    public ngOnDestroy() {

    }
}