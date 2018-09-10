import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService, EntityService } from '@services/master';

declare var $: any;

@Component({
    templateUrl: 'myws.comp.html'
})

export class MyWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    uid: number = 0;
    workspaceDT: any = [];
    entityDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _wsservice: WorkspaceService, private _enttservice: EntityService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getWorkspaceDetails();
        this.getWorkspaceEntity();
    }

    public ngOnInit() {
        
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

    // Get Workspace Wise Entity

    getWorkspaceEntity() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "entttype": "", "issysadmin": that.loginUser.issysadmin, "wsautoid": that.loginUser.wsautoid,
            "schoolid": that.loginUser.schoolid, "enttid": 0
        }

        that._enttservice.getEntityDetails(params).subscribe(data => {
            try {
                that.entityDT = data.data.filter(a => a.isactive == true);
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

    public openEntityForm(row) {
        sessionStorage.removeItem("_schwsdetails_");
        sessionStorage.setItem("_schwsdetails_", JSON.stringify(row));

        if (row.countentity !== "0") {
            this._router.navigate(['/workspace/entity']);
        }
        else {
            this._router.navigate(['/workspace/entity/add']);
        }
    }

    public openMainForm(row) {
        sessionStorage.removeItem("_schenttdetails_");
        sessionStorage.removeItem("_ayid_");

        sessionStorage.setItem("_schenttdetails_", JSON.stringify(row));
        this._router.navigate(['/']);
    }

    public addUserForm() {
        this._router.navigate(['/workspace/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/workspace/user/edit', row.uid]);
    }
}
