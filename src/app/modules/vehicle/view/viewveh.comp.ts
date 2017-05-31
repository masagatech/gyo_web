import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { VehicleService } from '../../../_services/vehicle/veh-service';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewveh.comp.html',
    providers: [CommonService, MenuService]
})

export class ViewVehicleComponent implements OnInit {
    vehicleDT: any = [];
    loginUser: LoginUserModel;

    ownerDT: any = [];
    ownerid: number = 0;
    ownername: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _vehservice: VehicleService) {
        this.loginUser = this._loginservice.getUser();
        this.viewVehicleDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed owner

    getOwnerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "owner",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": "coord",
            "search": query
        }).then((data) => {
            this.ownerDT = data;
        });
    }

    // Selected Owners

    selectOwnerData(event) {
        this.ownerid = event.value;
        this.ownername = event.label;

        this.getVehicleDetails();
    }

    public viewVehicleDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "mcode": "veh"
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getVehicleDetails();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getVehicleDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._vehservice.getVehicleDetails({
                "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "oid": that.ownerid
            }).subscribe(data => {
                try {
                    that.vehicleDT = data.data;
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

    public addVehicleForm() {
        this._router.navigate(['/vehicle/add']);
    }

    public editVehicleForm(row) {
        this._router.navigate(['/vehicle/edit', row.autoid]);
    }
}
