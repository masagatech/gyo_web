import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';
import { Globals } from '@globals';

@Injectable()
export class VehicleService {
    global = new Globals();

    constructor(private _dataserver: DataService, private _router: Router) { }

    getVehicleDetails(req: any) {
        return this._dataserver.post("getVehicleDetails", req)
    }

    saveVehicleInfo(req: any) {
        return this._dataserver.post("saveVehicleInfo", req)
    }

    saveVehicleInfoToVts(req: any) {
        return this._dataserver.otherpost(this.global.trackurl_trk + "tripapi/vehicle", req)
    }
}