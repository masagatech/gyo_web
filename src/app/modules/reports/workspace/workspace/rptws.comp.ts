import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'rptws.comp.html',
    providers: [WorkspaceService, CommonService]
})

export class WorkspaceReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    autoWorkspaceDT: any = [];
    autowsid: number = 0;
    autowsname: any = [];

    workspaceDT: any = [];
    global = new Globals();
    uploadconfig = { uploadurl: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        if (!this.loginUser.issysadmin && this.loginUser.utype !== "admin") {
            this._router.navigate(['/']);
        }

        this.getUploadConfig();

        if (Cookie.get('_autowsnm_') != null) {
            this.autowsname.value = parseInt(Cookie.get('_autowsid_'));
            this.autowsname.label = Cookie.get('_autowsnm_');
        }

        this.getWorkspaceDetails();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Auto Completed Workspace

    getAutoWorkspaceData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "workspace",
            "search": query
        }).subscribe((data) => {
            this.autoWorkspaceDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Workspace

    selectAutoWorkspaceData(event) {
        this.autowsid = event.value;

        Cookie.set("_autowsid_", event.value);
        Cookie.set("_autowsnm_", event.label);

        this.getWorkspaceDetails();
    }

    getUploadConfig() {
        this.uploadconfig.uploadurl = this.global.uploadurl;
    }

    getWorkspaceDetails() {
        var that = this;
        var myWorkspaceDT = [];

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({
            "flag": "userwise", "ucode": that.loginUser.ucode, "issysadmin": that.loginUser.issysadmin, "wsautoid": that.autowsid
        }).subscribe(data => {
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

    resetWorkspaceDetails() {
        this.autowsid = 0;
        this.autowsname = [];
        Cookie.delete("_autowsid_");
        Cookie.delete("_autowsnm_");

        this.getWorkspaceDetails();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
