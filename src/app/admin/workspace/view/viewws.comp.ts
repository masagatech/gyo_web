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
    wstype: string = "";
    wslogo: string = "";
    lgcode: string = "";
    issysadmin: boolean = false;

    headertitle: string = "";

    global = new Globals();
    uploadconfig = { uploadurl: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService) {
        this.loginUser = this._loginservice.getUser();
        this.getUploadConfig();
        Cookie.delete("_wsdetails_");

        this.getWorkspaceDetails();

        if (!this.loginUser.issysadmin && this.loginUser.utype !== "admin") {
            this._router.navigate(['/']);
        }
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
                that.wstype = myWorkspaceDT[0].wstype;
                that.wslogo = myWorkspaceDT[0].wslogo;
                that.lgcode = myWorkspaceDT[0].lgcode;
                that.issysadmin = myWorkspaceDT[0].issysadmin;
                that.headertitle = "My Workspace (" + myWorkspaceDT[0].wsname + ")";
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
        var _wsdetails = {
            "wsautoid": this.wsautoid.toString(),
            "wscode": this.wscode,
            "wsname": this.wsname,
            "wstype": this.wstype,
            "wslogo": this.wslogo,
            "issysadmin": this.issysadmin
        }

        Cookie.set("_wsdetails_", JSON.stringify(_wsdetails));
        this._router.navigate(['/']);
    }

    public getMainForm(row) {
        Cookie.set("_wsdetails_", JSON.stringify(row));
        this._router.navigate(['/']);
    }
}
