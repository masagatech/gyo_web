import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerLeaveService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'pendpsngrlv.comp.html',
    providers: [CommonService]
})

export class PendingPassengerLeaveComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    lvfor: string = "emp";
    pendingPassengerLeaveDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _psngrlvservice: PassengerLeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getPassengerLeave();
    }

    public ngOnInit() {

    }

    // View Data Rights

    getPassengerLeave() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": that.lvfor == "emp" ? "pendemp" : "pendpsngr", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }

        that._psngrlvservice.getPassengerLeave(params).subscribe(data => {
            try {
                that.pendingPassengerLeaveDT = data.data;
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

    public openApprovalForm(row) {
        this._router.navigate(['/erp/leave/approval/' + row.psngrid]);
    }
}