import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService, EntityService } from '@services/master';

declare var $: any;

@Component({
    templateUrl: 'viewws.comp.html',
})

export class ViewWorkspaceComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    workspaceDT: any = [];
    _wsdetails: any = [];

    autoWorkspaceDT: any = [];
    selectedWorkspace: any = [];
    autowsid: number = 0;
    autowsname: string = "";
    autotype: string = "";

    wsautoid: number = 0;
    schoolid: string = "";
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
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
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
            "issysadmin": this.loginUser.issysadmin,
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
        sessionStorage.setItem("_autowsid_", event.wsautoid);
        sessionStorage.setItem("_autowsnm_", event.label);
        sessionStorage.setItem("_autotype_", event.autotype);

        this.viewWorkspaceDetails();

        if (this.autotype !== "Workspace") {
            this.enttid = event.value;
            this.wsautoid = event.wsautoid;
            this.schoolid = event.schoolid;
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
            "flag": "userwise", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that.autowsid
        }).subscribe(data => {
            try {
                that.workspaceDT = data.data.filter(a => a.issysadmin === false);
                myWorkspaceDT = data.data.filter(a => a.issysadmin === true);

                if (that.autotype !== "Workspace") {
                    sessionStorage.removeItem("_schwsdetails_");
                    sessionStorage.setItem("_schwsdetails_", JSON.stringify(data.data[0]));
                }

                if (myWorkspaceDT.length > 0) {
                    that.wsautoid = myWorkspaceDT[0].wsautoid;
                    that.wscode = myWorkspaceDT[0].wscode;
                    that.wsname = myWorkspaceDT[0].wsname;
                    that.wstype = myWorkspaceDT[0].wstype;
                    that.wslogo = myWorkspaceDT[0].wslogo;
                    that.schoolid = myWorkspaceDT[0].schoolid;
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

        if (sessionStorage.getItem('_autowsnm_') != null) {
            that.autowsid = parseInt(sessionStorage.getItem("_autowsid_"));
            that.autowsname = sessionStorage.getItem("_autowsnm_");
            that.autotype = sessionStorage.getItem("_autotype_");

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

        sessionStorage.setItem("_entttype_", that.autotype);
        that.autotype = sessionStorage.getItem("_entttype_");

        commonfun.loader();

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "entttype": that.autotype, "issysadmin": that.loginUser.issysadmin, "wsautoid": that.wsautoid,
            "schoolid": that.schoolid, "enttid": that.enttid
        }

        that._entityservice.getEntityDetails(params).subscribe(data => {
            try {
                var row = data.data[0];

                if (row.isactive) {
                    sessionStorage.removeItem("_schenttdetails_");
                    sessionStorage.removeItem("_ayid_");

                    sessionStorage.setItem("_schenttdetails_", JSON.stringify(row));
                    that._router.navigate(['/']);
                }
                else {
                    that._msg.Show(messageType.error, "Error", "This " + row.entttype + " is Deactive");
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
        var that = this;

        that.selectedWorkspace = [];
        that.autowsid = 0;
        that.autowsname = "";
        that.autotype = "";
        sessionStorage.removeItem("_autowsid_");
        sessionStorage.removeItem("_autowsnm_");
        sessionStorage.removeItem("_autotype_");

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
            "schoolid": this.schoolid,
            "enttid": 0,
            "issysadmin": this.issysadmin
        }

        sessionStorage.setItem("_schwsdetails_", JSON.stringify(_wsdetails));
        this._router.navigate(['/workspace/entity']);
    }

    public openEntityForm(row) {
        if (row.isactive) {
            sessionStorage.removeItem("_schwsdetails_");
            sessionStorage.setItem("_schwsdetails_", JSON.stringify(row));

            if (row.countentity !== "0") {
                this._router.navigate(['/workspace/entity']);
            }
            else {
                this._router.navigate(['/workspace/entity/add']);
            }
        }
        else {
            this._msg.Show(messageType.error, "Error", "This Workspace is Deactive");
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
