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
    templateUrl: 'trackord.comp.html',
    providers: [CommonService, MenuService, OrderService]
})

export class TrackOrderComponent implements OnInit {
    selectedOrderType: string = "pending";

    orderDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ordservice: OrderService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        
    }
}
