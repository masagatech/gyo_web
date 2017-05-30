import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class RiderService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getRiderDetails(req: any) {
        return this._dataserver.post("mrcht/getRiderDetails", req)
    }

    saveRiderInfo(req: any) {
        return this._dataserver.post("mrcht/saveRiderInfo", req)
    }
}