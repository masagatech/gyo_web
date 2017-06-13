import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { DriverService } from '../../../_services/driver/driver-service';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Globals } from '../../../_const/globals';

@Component({
    templateUrl: 'viewdriver.comp.html',
    providers: [CommonService, MenuService, DriverService]
})

export class ViewDriverComponent implements OnInit {
    driverDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _driverservice: DriverService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewDriverDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
            "issysadmin": this._wsdetails.issysadmin,
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

        Cookie.set("_drventtid_", this.entityid.toString());
        Cookie.set("_drventtnm_", this.entityname);

        this.getDriverDetails();
    }

    public viewDriverDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "drv", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_drventtnm_') != null) {
                that.entityid = parseInt(Cookie.get('_drventtid_'));
                that.entityname = Cookie.get('_drventtnm_');
                that.getDriverDetails();
            }
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getDriverDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._driverservice.getDriverDetails({
                "flag": "all",
                "uid": that.loginUser.uid,
                "utype": that.loginUser.utype,
                "schid": that.entityid,
                "wsautoid": that._wsdetails.wsautoid,
            }).subscribe(data => {
                try {
                    that.driverDT = data.data;
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

    public addDriverForm() {
        this._router.navigate(['/driver/add']);
    }

    public editDriverForm(row) {
        this._router.navigate(['/driver/edit', row.autoid]);
    }
}
