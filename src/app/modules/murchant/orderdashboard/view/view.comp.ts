import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { MenuService } from '../../../../_services/menus/menu-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';
import { CommonService } from '../../../../_services/common/common-service'; /* add reference for master of master */
import { OrderService } from '../../../../_services/order/ord-service';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';

@Component({
    templateUrl: 'view.comp.html',
    providers: [CommonService, MenuService]
})

export class ViewComponent implements OnInit {
    selectedOrderType: string = "pending";
    ordtype: SelectItem[];

    orderDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    status: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ordservice: OrderService) {
        this.loginUser = this._loginservice.getUser();
        this.status = "pending";
        this.getOrderType();
        this.getOrderDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewOrderDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "ord", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getOrderDetails();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getOrderType() {
        this.ordtype = [];
        this.ordtype.push({ label: 'Pending', value: 'pending' });
        this.ordtype.push({ label: 'Accepted', value: 'accepted' });
    }

    getOrderDetails() {
        var that = this;

        // if (that.actviewrights === "view") {
        commonfun.loader();

        that._ordservice.getOrderDetails({
            "flag": "summary", "status": that.selectedOrderType
        }).subscribe(data => {
            try {
                that.orderDT = data.data;
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
        // }
    }

    public addOrderForm() {
        this._router.navigate(['/murchant/createorder']);
    }

    public editOrderForm(row) {
        this._router.navigate(['/murchant/editorder', row.autoid]);
    }
}
