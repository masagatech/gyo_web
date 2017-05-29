import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class OutletService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOutletDetails(req: any) {
        return this._dataserver.post("mrcht/getOutletDetails", req)
    }

    saveOutletInfo(req: any) {
        return this._dataserver.post("mrcht/saveOutletInfo", req)
    }
}