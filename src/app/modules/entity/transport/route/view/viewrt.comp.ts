import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { RouteService } from '@services/master';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'viewrt.comp.html'
})

export class ViewRouteComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    stopsDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rtservice: RouteService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getStopsDetails();
    }

    public ngOnInit() {
        
    }

    getStopsDetails() {
        var that = this;

        commonfun.loader();

        that._rtservice.getStopsDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.stopsDT = data.data;
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

    public addRoutesForm() {
        this._router.navigate(['/transport/route/add']);
    }

    public editRoutesForm(row) {
        this._router.navigate(['/transport/route/edit', row.key.split('~')[0]]);
    }
}
