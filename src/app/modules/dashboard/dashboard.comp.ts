import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../_services/messages/message-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'dashboard.comp.html',
    providers: [CommonService]
})

export class DashboardComponent implements OnInit, OnDestroy {
    dashboardDT: any = [];
    loginUser: LoginUserModel;

    constructor(private _autoservice: CommonService, private _loginservice: LoginService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.getDashboard();
    }

    // Dashboard

    getDashboard() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDashboard({ "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
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

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}