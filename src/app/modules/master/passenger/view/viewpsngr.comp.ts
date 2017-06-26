import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewpsngr.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewPassengerComponent implements OnInit {
    passengerDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    autoEntityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    autoPassengerDT: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrservice: PassengerService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.viewPassengerDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
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
            this.autoEntityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", this.enttid.toString());
        Cookie.set("_enttnm_", this.enttname);

        this.getPassengerData(event);
        this.getPassengerDetails();
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "id": this.enttid,
            "search": query
        }).subscribe((data) => {
            this.autoPassengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        this.psngrid = event.value;
        this.psngrname = event.label;

        Cookie.set("_psngrid_", this.psngrid.toString());
        Cookie.set("_psngrnm_", this.psngrname);

        this.getPassengerDetails();
    }

    // View Data Rights

    public viewPassengerDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "psngr", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_enttnm_') != null) {
                that.enttid = parseInt(Cookie.get('_enttid_'));
                that.enttname = Cookie.get('_enttnm_');

                that.psngrid = parseInt(Cookie.get('_psngrid_'));
                that.psngrname = Cookie.get('_psngrnm_');

                that.getPassengerDetails();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getPassengerDetails() {
        var that = this;
        var params = {};

        if (that.actviewrights === "view") {
            commonfun.loader();

            if (that.psngrname == "") {
                Cookie.set("_psngrid_", "0");
                Cookie.set("_psngrnm_", "");
                
                that.psngrid = parseInt(Cookie.get('_psngrid_'));
                that.psngrname = Cookie.get('_psngrnm_');
            }

            params = {
                "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                "schid": that.enttid, "stdid": that.psngrid.toString() == "" ? 0 : that.psngrid,
                "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
            };

            that._psngrservice.getPassengerDetails(params).subscribe(data => {
                try {
                    console.log(params);
                    that.passengerDT = data.data;
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

    public addPassengerForm() {
        this._router.navigate(['/master/passenger/add']);
    }

    public editPassengerForm(row) {
        if (row.isactive) {
            this._router.navigate(['/master/passenger/edit', row.autoid]);
        }
        else {
            this._msg.Show(messageType.error, "Error", "This Records is Deactivated");
        }
    }
}
