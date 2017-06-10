import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { WorkspaceService } from '../../../_services/workspace/ws-service';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Globals } from '../../../_const/globals';

declare var $: any;

@Component({
    templateUrl: 'viewws.comp.html',
    providers: [WorkspaceService]
})

export class ViewWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    workspaceDT: any = [];
    
    wsautoid: number = 0;
    wscode: string = "";
    wsname: string = "";
    wslogo: string = "";
    lgcode: string = "";
    headertitle: string = "";
    
    global = new Globals();
    uploadconfig = { uploadurl: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService) {
        this.loginUser = this._loginservice.getUser();
        this.getUploadConfig();

        this.getWorkspaceDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getUploadConfig() {
        this.uploadconfig.uploadurl = this.global.uploadurl
    }

    getWorkspaceDetails() {
        var that = this;
        var myWorkspaceDT = [];

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({ "flag": "all" }).subscribe(data => {
            try {
                that.workspaceDT = data.data.filter(a => a.issysadmin === false);
                myWorkspaceDT = data.data.filter(a => a.issysadmin === true);

                that.wsautoid = myWorkspaceDT[0].wsautoid;
                that.wscode = myWorkspaceDT[0].wscode;
                that.wsname = myWorkspaceDT[0].wsname;
                that.wslogo = myWorkspaceDT[0].wslogo;
                that.lgcode = myWorkspaceDT[0].lgcode;
                that.headertitle = "My Workspace";
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

    public addWorkspaceForm() {
        this._router.navigate(['/workspace/add']);
    }

    public editWorkspaceForm(row) {
        this._router.navigate(['/workspace/edit', row.wsautoid]);
    }

    public openForm() {
        Cookie.set("_wsautoid_", this.wsautoid.toString());
        Cookie.set("_wsname_", this.wsname);
        Cookie.set("_wslogo_", this.wslogo);

        this._router.navigate(['/']);
    }

    public getMainForm(row) {
        Cookie.set("_wsautoid_", row.wsautoid);
        Cookie.set("_wsname_", row.wsname);
        Cookie.set("_wslogo_", row.wslogo);

        this._router.navigate(['/']);
    }
}
