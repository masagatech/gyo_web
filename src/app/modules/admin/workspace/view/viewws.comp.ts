import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService, EntityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewws.comp.html',
})

export class ViewWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    workspaceDT: any = [];
    _wsdetails: any = [];

    autoWorkspaceDT: any = [];
    selectedWorkspace: any = [];
    autowsid: number = 0;
    autowsname: string = "";
    autotype: string = "";

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

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService, private _entityservice: EntityService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getUploadConfig();
        this.viewWorkspaceDetails();

        if (!this.loginUser.issysadmin && this.loginUser.utype !== "admin") {
            this._router.navigate(['/']);
        }
    }

    public ngOnInit() {

    }

    isshWorkspace(viewtype) {
        var that = this;
        commonfun.loader("#divShow");

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
            commonfun.loaderhide("#divShow");
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
            commonfun.loaderhide("#divShow");
        }
    }

    // Auto Completed Workspace

    getAutoWorkspaceData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "workspace",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
            "issysadmin": false,
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
        Cookie.set("_autowsid_", event.wsautoid);
        Cookie.set("_autowsnm_", event.label);
        Cookie.set("_autotype_", event.autotype);

        this.viewWorkspaceDetails();

        if (this.autotype !== "Workspace") {
            this.enttid = event.value;
            this.wsautoid = event.wsautoid;
            this.getEntityDetails();
        }
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

    viewWorkspaceDetails() {
        var that = this;

        if (Cookie.get('_autowsnm_') != null) {
            that.autowsid = parseInt(Cookie.get("_autowsid_"));
            that.autowsname = Cookie.get("_autowsnm_");
            that.autotype = Cookie.get("_autotype_");

            that.selectedWorkspace = {
                value: that.autowsid,
                label: that.autowsname,
                autotype: that.autotype
            }
        }

        that.getWorkspaceDetails();
    }

    getEntityDetails() {
        var that = this;
        var params = {};

        Cookie.set("_entttype_", that.autotype);
        that.autotype = Cookie.get('_entttype_');

        commonfun.loader();

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "entttype": that.autotype, "issysadmin": that.loginUser.issysadmin, "wsautoid": that.wsautoid,
            "schoolid": that._wsdetails.schoolid, "enttid": that.enttid
        }

        that._entityservice.getEntityDetails(params).subscribe(data => {
            try {
                var row = data.data[0];

                Cookie.delete("_schenttdetails_");
                Cookie.delete("_ayid_");

                Cookie.set("_schenttdetails_", JSON.stringify(row));
                that._router.navigate(['/']);
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
        var that = this;

        that.selectedWorkspace = [];
        that.autowsid = 0;
        that.autowsname = "";
        that.autotype = "";
        Cookie.delete("_autowsid_");
        Cookie.delete("_autowsnm_");
        Cookie.delete("_autotype_");

        that.getWorkspaceDetails();
    }

    public addWorkspaceForm() {
        this._router.navigate(['/admin/workspace/add']);
    }

    public editWorkspaceForm(row) {
        this._router.navigate(['/admin/workspace/edit', row.wsautoid]);
    }

    public openForm() {
        var _wsdetails = {
            "wsautoid": this.wsautoid.toString(),
            "wscode": this.wscode,
            "wsname": this.wsname,
            "wstype": this.wstype,
            "wslogo": this.wslogo,
            "enttid": 0,
            "issysadmin": this.issysadmin
        }

        Cookie.set("_schwsdetails_", JSON.stringify(_wsdetails));
        this._router.navigate(['/workspace/entity']);
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
}
