import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
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
}