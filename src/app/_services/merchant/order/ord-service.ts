import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class OrderService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOrderDetails(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "getOrderDetails", req)
    }

    saveOrderInfo(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "saveOrderInfo", req)
    }

    getOrderdash(req: any) {
        return this._dataserver.get(Globals.mrchtroute + "getOrderDash", req)
    }

    getOrderDetailsDash(req: any) {
        return this._dataserver.get(Globals.mrchtroute + "getDashOrdDetails", req)
    }

    pushOrderToRider(req: any) {
        return this._dataserver.post("mrcht/pushOrderToRider", req)
    }
}