import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';
import { Globals } from '@globals';

@Injectable()
export class InventoryService {
    global = new Globals();

    constructor(private _dataserver: DataService, private _router: Router) { }

    // Device

    getDeviceDetails(req: any) {
        return this._dataserver.post("getDeviceDetails", req)
    }

    saveDeviceInfo(req: any) {
        return this._dataserver.post("saveDeviceInfo", req)
    }

    // Sim

    getSimDetails(req: any) {
        return this._dataserver.post("getSimDetails", req)
    }

    saveSimInfo(req: any) {
        return this._dataserver.post("saveSimInfo", req)
    }

    // Device Sim Map

    getDeiviceSimMapping(req: any) {
        return this._dataserver.post("getDeiviceSimMapping", req)
    }

    saveDeiviceSimMapping(req: any) {
        return this._dataserver.post("saveDeiviceSimMapping", req)
    }
}