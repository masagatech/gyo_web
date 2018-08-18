import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { DashboardService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'dashboard.comp.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    dashboardDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _dbservice: DashboardService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        let _schwsdetails = sessionStorage.getItem("_schwsdetails_");

        if (_schwsdetails == null && _schwsdetails == undefined) {
            this._router.navigate(['/admin/workspace']);
        }

        this.getDashboard();
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
        else if (row.dbtype == "entity") {
            sessionStorage.removeItem('_entttype_');
            sessionStorage.setItem("_entttype_", row.dbcode);
        }

        that._router.navigate([row.dblink]);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}