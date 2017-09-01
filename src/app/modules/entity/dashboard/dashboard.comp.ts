import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'dashboard.comp.html',
    providers: [CommonService]
})

export class DashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    dashboardDT: any = [];

    constructor(private _autoservice: CommonService, private _loginservice: LoginService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        let _schwsdetails = Cookie.get("_schwsdetails_");
        let _schenttdetails = Cookie.get("_schenttdetails_");

        if (_schwsdetails == null && _schwsdetails == undefined) {
            this._router.navigate(['/admin/workspace']);
        }
        else {
            if (_schenttdetails == null && _schenttdetails == undefined) {
                this._router.navigate(['/workspace/entity']);
            }
        }

        this.getDashboard();
    }

    // Dashboard

    getDashboard() {
        var that = this;
        commonfun.loader();

        var dbparams = {
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid,
            "enttid": that._enttdetails.enttid, "psngrtype": that._enttdetails.psngrtype, "dbview": "entt"
        }

        that._autoservice.getDashboard(dbparams).subscribe(data => {
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
            Cookie.delete('_srcutype_');
            Cookie.delete('_enttid_');
            Cookie.delete('_enttnm_');

            Cookie.set("_srcutype_", row.dbcode);
            Cookie.set("_enttid_", that._enttdetails.enttid);
            Cookie.set("_enttnm_", that._enttdetails.enttname);
        }
        else if (row.dbtype == "entity") {
            Cookie.delete('_entttype_');
            Cookie.set("_entttype_", row.dbcode);
        }

        that._router.navigate([row.dblink]);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}