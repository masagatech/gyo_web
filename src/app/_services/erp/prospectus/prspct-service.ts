import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ProspectusService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Prospectus

    saveProspectusInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveProspectusInfo", req)
    }

    getProspectusDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getProspectusDetails", req)
    }
    
    // Prospectus Issued

    saveProspectusIssued(req: any) {
        return this._dataserver.post(Globals.erproute + "saveProspectusIssued", req)
    }

    getProspectusIssued(req: any) {
        return this._dataserver.post(Globals.erproute + "getProspectusIssued", req)
    }
}