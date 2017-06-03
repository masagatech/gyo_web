import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class MerchantService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getMerchantDetails(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "getMerchantDetails", req)
    }

    saveMerchantInfo(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "saveMerchantInfo", req)
    }
}