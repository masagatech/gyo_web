import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../_services/common/common-service'; /* add reference for master of master */
import { MenuService } from '../../../../_services/menus/menu-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';
import { EntityService } from '../../../../_services/entity/entity-service';

@Component({
    templateUrl: 'viewentity.comp.html',
    providers: [MenuService, EntityService, CommonService]
})

export class ViewEntityComponent implements OnInit {
    loginUser: LoginUserModel;

    entityDT: any = [];

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _entityervice: EntityService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.viewEntityDataRights();
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

    public viewEntityDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "ol", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getEntityGrid();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getEntityGrid() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._entityervice.getEntityDetails({ "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
                try {
                    that.entityDT = data.data;
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

    public addentityForm() {
        this._router.navigate(['/entity/add']);
    }

    public editentityGrid(row) {
        this._router.navigate(['/entity/edit', row.hldid]);
    }
}