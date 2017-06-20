import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class VehicleService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getVehicleDetails(req: any) {
        return this._dataserver.post("getVehicleDetails", req)
    }

    saveVehicleInfo(req: any) {
        return this._dataserver.post("saveVehicleInfo", req)
    }
}