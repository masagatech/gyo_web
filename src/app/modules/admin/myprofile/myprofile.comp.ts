import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'myprofile.comp.html',
    providers: [CommonService]
})

export class MyProfileComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    uid: number = 0;
    usersDT: any = [];
    entityDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _autoservice: CommonService, private _loginservice: LoginService, private _userservice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getUserDetails();
        this.getUserEntity();
    }

    public ngOnInit() {
        var that = this;
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        commonfun.loader();

        uparams = {
            "flag": "allprofile", "id": that.loginUser.loginid
        };

        that._userservice.getUserDetails(uparams).subscribe(data => {
            try {
                that.usersDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#users");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#users");
        }, () => {

        })
    }

    // Get User Entity

    getUserEntity() {
        var that = this;
        var uparams = {};

        commonfun.loader();

        uparams = {
            "flag": "userentity", "id": that.loginUser.loginid
        };

        that._userservice.getUserDetails(uparams).subscribe(data => {
            try {
                that.entityDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#users");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#users");
        }, () => {

        })
    }

    public addUserForm() {
        this._router.navigate(['/workspace/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/workspace/user/edit', row.uid]);
    }

    public openMainForm(row) {
        Cookie.delete("_schenttdetails_");

        Cookie.set("_schenttdetails_", JSON.stringify(row));
        this._router.navigate(['/']);
    }
}
