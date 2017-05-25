import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TTMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTripData(req: any) {
        return this._dataserver.post("tripapi", req)
    }

    showPassengerList(req: any) {
        return this._dataserver.post("tripapi/crews", req)
    }

    getLastLocation(req: any) {
        return this._dataserver.post("tripapi/getdelta", req)
    }

    getTripTrackingData(req: any) {
        return this._dataserver.otherpost("tripapi/getdelta", req)
    }
}