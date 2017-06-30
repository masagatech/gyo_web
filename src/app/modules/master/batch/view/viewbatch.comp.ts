import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BatchService } from '@services/master';

@Component({
    templateUrl: 'viewbatch.comp.html',
    providers: [CommonService, MenuService]
})

export class ViewBatchComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    batchDT: any = [];

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _batchervice: BatchService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewBatchDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $(".entityname input").focus();
        }, 100);
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Owners

    selectEntityData(event) {
        this.entityid = event.value;
        this.entityname = event.label;

        Cookie.set("_enttid_", this.entityid.toString());
        Cookie.set("_enttnm_", this.entityname);

        this.getBatchDetails();
    }

    public viewBatchDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "btc", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                that.entityid = parseInt(Cookie.get('_enttid_'));
                that.entityname = Cookie.get('_enttnm_');
                that.getBatchDetails();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getBatchDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._batchervice.getBatchDetails({
                "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                "issysadmin": that.loginUser.issysadmin, "schid": that.entityid, "wsautoid": that._wsdetails.wsautoid
            }).subscribe(data => {
                try {
                    that.batchDT = data.data;
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
    }

    public addBatchForm() {
        this._router.navigate(['/master/batch/add']);
    }

    public editBatchForm(row) {
        this._router.navigate(['/master/batch/edit', row.autoid]);
    }
}
