import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class OrderService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOrderDetails(req: any) {
        return this._dataserver.post("mrcht/getOrderDetails", req)
    }

    saveOrderInfo(req: any) {
        return this._dataserver.post("mrcht/saveOrderInfo", req)
    }

    getOrderdash(req: any) {
        return this._dataserver.get("mrcht/getOrderDash", req)
    }

    getOrderDetailsDash(req: any) {
        return this._dataserver.get("mrcht/getDashOrdDetails", req)
    }

    pushOrderToRider(req: any) {
        return this._dataserver.post("mrcht/pushOrderToRider", req)
    }
}