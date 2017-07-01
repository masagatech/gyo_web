import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewws.comp.html',
    providers: [WorkspaceService, CommonService]
})

export class ViewWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    workspaceDT: any = [];
    _wsdetails: any = [];

    autoWorkspaceDT: any = [];
    autowsid: number = 0;
    autowsname: string = "";

    wsautoid: number = 0;
    wscode: string = "";
    wsname: string = "";
    wstype: string = "";
    wslogo: string = "";
    lgcode: string = "";
    issysadmin: boolean = false;

    enttid: number = 0;
    enttnm: string = "";

    headertitle: string = "";

    global = new Globals();
    uploadconfig = { uploadurl: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getUploadConfig();

        if (Cookie.get('_autowsnm_') != null) {
            this.autowsid = parseInt(Cookie.get('_autowsid_'));
            this.autowsname = Cookie.get('_autowsnm_');
        }

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
        this.autowsname = event.label;

        Cookie.set("_autowsid_", this.autowsid.toString());
        Cookie.set("_autowsnm_", this.autowsname);

        this.getWorkspaceDetails();
    }

    getUploadConfig() {
        this.uploadconfig.uploadurl = this.global.uploadurl
    }

    getWorkspaceDetails() {
        var that = this;
        var myWorkspaceDT = [];

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({
            "flag": "userwise", "ucode": that.loginUser.ucode, "issysadmin": that.loginUser.issysadmin, "wsautoid": that.autowsid
        }).subscribe(data => {
            try {
                that.workspaceDT = data.data.filter(a => a.issysadmin === false);
                myWorkspaceDT = data.data.filter(a => a.issysadmin === true);

                if (myWorkspaceDT.length > 0) {
                    that.wsautoid = myWorkspaceDT[0].wsautoid;
                    that.wscode = myWorkspaceDT[0].wscode;
                    that.wsname = myWorkspaceDT[0].wsname;
                    that.wstype = myWorkspaceDT[0].wstype;
                    that.wslogo = myWorkspaceDT[0].wslogo;
                    that.lgcode = myWorkspaceDT[0].lgcode;
                    that.issysadmin = myWorkspaceDT[0].issysadmin;

                    that.enttid = myWorkspaceDT[0].enttid;
                    that.enttnm = myWorkspaceDT[0].enttnm;
                    that.headertitle = "My Workspace (" + myWorkspaceDT[0].wsname + ")";
                }
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
        this.autowsname = "";
        Cookie.delete("_autowsid_");
        Cookie.delete("_autowsnm_");

        this.getWorkspaceDetails();
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

        if (this.enttid !== 0) {
            Cookie.set("_enttid_", this.enttid.toString());
            Cookie.set("_enttnm_", this.enttnm);
        }

        this._router.navigate(['/']);
    }

    public getMainForm(row) {
        Cookie.set("_wsdetails_", JSON.stringify(row));

        if (row.enttid !== 0) {
            Cookie.set("_enttid_", row.enttid.toString());
            Cookie.set("_enttnm_", row.enttnm);
        }

        this._router.navigate(['/']);
    }
}
