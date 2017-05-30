import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { MerchantService } from '@services/merchant';
import { LoginUserModel } from '@models';

@Component({
    templateUrl: 'viewmrcht.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewMerchantComponent implements OnInit {
    loginUser: LoginUserModel;

    merchantDT: any = [];

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _mrchtervice: MerchantService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.viewMerchantDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
            commonfun.chevronstyle();
        }, 0);
    }

    public viewMerchantDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "mrchtp", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getMerchantGrid();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getMerchantGrid() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._mrchtervice.getMerchantDetails({ "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
                try {
                    that.merchantDT = data.data;
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide();
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {

            })
        }
    }

    fetchEvents(eventData) {
        console.log("fetchEvents:", eventData.view, eventData.element);
    }

    public addMerchantForm() {
        this._router.navigate(['/merchant/add']);
    }

    public editMerchantGrid(row) {
        this._router.navigate(['/merchant/edit', row.mrchtid]);
    }
}