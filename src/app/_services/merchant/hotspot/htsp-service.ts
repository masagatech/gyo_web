import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class HotspotService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getHotspotDetails(req: any) {
        return this._dataserver.post("getHotspotDetails", req)
    }

    saveHotspotInfo(req: any) {
        return this._dataserver.post("saveHotspotInfo", req)
    }
}