import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { OrderService } from '@services/merchant';
import { LoginUserModel } from '@models';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';

@Component({
    templateUrl: 'vieword.comp.html',
    providers: [CommonService, MenuService, OrderService]
})

export class ViewOrderComponent implements OnInit {
    orderDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ordservice: OrderService) {
        this.loginUser = this._loginservice.getUser();
        this.AddEditOrderDataRights();
        this.viewOrderDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public AddEditOrderDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "mcode": "cord"
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    public viewOrderDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "mcode": "vord"
        }).subscribe(data => {
            viewRights = data.data.filter(a => a.mrights === "allowed");
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getOrderDetails();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getOrderDetails() {
        var that = this;

        if (that.actviewrights === "allowed") {
            commonfun.loader();

            that._ordservice.getOrderDetails({
                "flag": "summary", "status": "all", "uid": that.loginUser.uid
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0 && data.data[0].errmsgcode !== "norecords") {
                        that.orderDT = data.data;
                    }
                    else {
                        that.orderDT = [];
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
    }

    public addOrderForm() {
        this._router.navigate(['/merchant/createorder']);
    }

    public editOrderForm(row) {
        this._router.navigate(['/merchant/editorder', row.ordid]);
    }
}
