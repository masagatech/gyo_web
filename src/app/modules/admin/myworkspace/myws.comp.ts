import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'myws.comp.html',
    providers: [CommonService]
})

export class MyWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    uid: number = 0;
    workspaceDT: any = [];
    entityDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _autoservice: CommonService, private _loginservice: LoginService, private _wsservice: WorkspaceService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getWorkspaceDetails();
        this.getWorkspaceEntity();
    }

    public ngOnInit() {
        var that = this;
    }

    getWorkspaceDetails() {
        var that = this;
        var wsparams = {};

        commonfun.loader();

        wsparams = {
            "flag": "userwise", "uid": that.loginUser.wsautoid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "wsautoid": that.loginUser.wsautoid, "srcwsid": that.loginUser.wsautoid, "issysadmin": that.loginUser.issysadmin
        };

        that._wsservice.getWorkspaceDetails(wsparams).subscribe(data => {
            try {
                that.workspaceDT = data.data;
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

    // Get User Entity

    getWorkspaceEntity() {
        var that = this;
        var wsparams = {};

        commonfun.loader();

        wsparams = {
            "flag": "wsentity", "wsautoid": that.loginUser.wsautoid
        };

        that._wsservice.getWorkspaceDetails(wsparams).subscribe(data => {
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

    public openEntityForm(row) {
        Cookie.delete("_schwsdetails_");
        Cookie.set("_schwsdetails_", JSON.stringify(row));

        if (row.countentity !== "0") {
            this._router.navigate(['/workspace/entity']);
        }
        else {
            this._router.navigate(['/workspace/entity/add']);
        }
    }

    public openMainForm(row) {
        Cookie.delete("_schenttdetails_");

        Cookie.set("_schenttdetails_", JSON.stringify(row));
        this._router.navigate(['/']);
    }

    public addUserForm() {
        this._router.navigate(['/workspace/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/workspace/user/edit', row.uid]);
    }
}
