import { NgModule, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedComponentModule } from '../../../../_shared/sharedcomp.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { MenuService } from '../../../../_services/menus/menu-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';
import { CommonService } from '../../../../_services/common/common-service'; /* add reference for master of master */
import { OrderService } from '../../../../_services/order/ord-service';
import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

@Component({
    selector: '<datagrid></datagrid>',
    templateUrl: 'datagrid.comp.html',
    providers: [CommonService, MenuService, OrderService]
})

export class DataGridComponent implements OnInit {
    loginUser: LoginUserModel;

    bindData: any = [];
    @Input() status: string = "pending";

    schoolDT: any = [];
    schoolid: number = 0;
    schoolname: string = "";

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ordservice: OrderService) {
        this.loginUser = this._loginservice.getUser();
        this.getOrderDetails();
    }

    public ngOnInit() {
        
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
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    public getOrderDetails() {
        var that = this;
        that.bindData = [];

        // if (that.actviewrights === "view") {
        commonfun.loader();

        that._ordservice.getOrderDetails({
            "flag": "summary", "status": that.status
        }).subscribe(data => {
            try {
                that.bindData = data.data;
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
        this._router.navigate(['/createorder']);
    }

    public editOrderForm(row) {
        this._router.navigate(['/editorder', row.autoid]);
    }
}

@NgModule({
    imports: [CommonModule, FormsModule, SharedComponentModule, DataTableModule],
    declarations: [
        DataGridComponent
    ],
    exports: [DataGridComponent]
})

export class DataGridModule {

}