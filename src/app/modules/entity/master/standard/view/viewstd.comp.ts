import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService } from '@services/master';

@Component({
    templateUrl: 'viewstd.comp.html'
})

export class ViewStandardComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    standardDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _clsservice: ClassService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getStandardDetails();
    }

    public ngOnInit() {

    }

    getStandardDetails() {
        var that = this;
        commonfun.loader();

        that._clsservice.getStandardDetails({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.standardDT = data.data;
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

    public addStandard() {
        this._router.navigate(['/master/standard/add']);
    }

    public editStandard(row) {
        this._router.navigate(['/master/standard/edit', row.stdid]);
    }
}
