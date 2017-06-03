import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { HotspotService } from '@services/merchant';
import { LoginUserModel } from '@models';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewhtsp.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewHotspotComponent implements OnInit {
    hotspotDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rdrservice: HotspotService) {
        this.loginUser = this._loginservice.getUser();
        this.viewHotspotDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Access Data Rights

    public viewHotspotDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "htsp", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getHotspotDetails();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getHotspotDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rdrservice.getHotspotDetails({
                "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype
            }).subscribe(data => {
                try {
                    that.hotspotDT = data.data;
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

    public addHotspotForm() {
        this._router.navigate(['/merchant/hotspot/add']);
    }

    public editHotspotForm(row) {
        this._router.navigate(['/merchant/hotspot/edit', row.htspid]);
    }
}
