import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class RiderService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getRiderDetails(req: any) {
        return this._dataserver.post("getRiderDetails", req)
    }

    saveRiderInfo(req: any) {
        return this._dataserver.post("saveRiderInfo", req)
    }

     getAvailable(req: any) {
        return this._dataserver.get("mrcht/getAvailRider", req)
    }
}