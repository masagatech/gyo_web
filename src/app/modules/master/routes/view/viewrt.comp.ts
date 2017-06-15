import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { MenuService } from '../../../../_services/menus/menu-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';
import { CommonService } from '../../../../_services/common/common-service'; /* add reference for master of master */
import { RoutesService } from '../../../../_services/routes/rt-service';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewrt.comp.html',
    providers: [CommonService, MenuService]
})

export class ViewRoutesComponent implements OnInit {
    stopsDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rtservice: RoutesService) {
        this.loginUser = this._loginservice.getUser();
        this.viewStopsDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewStopsDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "stp", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getStopsDetails();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getStopsDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rtservice.getStopsDetails({
                "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype
            }).subscribe(data => {
                try {
                    that.stopsDT = data.data;
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

    public addStopsForm() {
        this._router.navigate(['/routes/add']);
    }

    public editStopsForm(row) {
        this._router.navigate(['/routes/edit', row.stpid]);
    }
}
