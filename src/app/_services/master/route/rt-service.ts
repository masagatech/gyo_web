import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class RouteService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveRoutesInfo(req: any) {
        return this._dataserver.post("saveRoutesInfo", req)
    }

    saveStopsInfo(req: any) {
        return this._dataserver.post("saveStopsInfo", req)
    }

    getStopsDetails(req: any) {
        return this._dataserver.post("getStopsDetails", req)
    }
}