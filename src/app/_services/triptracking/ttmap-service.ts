import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TTMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTripTracking(req: any) {
        return this._dataserver.post("tripapi", req)
    }

    getTripTrackingData(req: any) {
        return this._dataserver.otherpost("getdelta", req)
    }
}