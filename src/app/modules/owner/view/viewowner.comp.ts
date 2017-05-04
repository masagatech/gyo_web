import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { OwnerService } from '../../../_services/owner/owner-service';

@Component({
    templateUrl: 'viewowner.comp.html',
    providers: [MenuService, OwnerService]
})

export class ViewOwnerComponent implements OnInit {
    ownerDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _ownerservice: OwnerService) {
        this.loginUser = this._loginservice.getUser();
        this.viewOwnerDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewOwnerDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({ "flag": "actrights", "uid": that.loginUser.uid, "mid": "5", "utype": that.loginUser.utype }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getOwnerDetails();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getOwnerDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._ownerservice.getOwnerDetails({ "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
                try {
                    that.ownerDT = data.data;
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

    public addOwnerForm() {
        this._router.navigate(['/owner/add']);
    }

    public editOwnerForm(row) {
        this._router.navigate(['/owner/edit', row.autoid]);
    }
}
