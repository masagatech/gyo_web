import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class LocationService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getLocationDetails(req: any) {
        return this._dataserver.post("getLocationDetails", req)
    }

    saveLocationInfo(req: any) {
        return this._dataserver.post("saveLocationInfo", req)
    }
}