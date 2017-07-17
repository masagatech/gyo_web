import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class UserVehicleMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getUserVehicleMap(req: any) {
        return this._dataserver.post("getUserVehicleMap", req)
    }

    saveUserVehicleMap(req: any) {
        return this._dataserver.post("SaveUserVehicleMap", req)
    }
}