import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ProspectusService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveProspectusInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveProspectusInfo", req)
    }

    getProspectusDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getProspectusDetails", req)
    }
}