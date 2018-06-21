import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class FeesService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Reports

    getFeesReports(req: any) {
        return this._dataserver.post(Globals.erproute + "getFeesReports", req)
    }

    // Fees Structure

    saveFeesStructure(req: any) {
        return this._dataserver.post(Globals.erproute + "saveFeesStructure", req)
    }

    getFeesStructure(req: any) {
        return this._dataserver.post(Globals.erproute + "getFeesStructure", req)
    }

    // Fees Excemption

    saveFeesExcemption(req: any) {
        return this._dataserver.post(Globals.erproute + "saveFeesExcemption", req)
    }

    getFeesExcemption(req: any) {
        return this._dataserver.post(Globals.erproute + "getFeesExcemption", req)
    }

    // Fees Collection

    saveFeesCollection(req: any) {
        return this._dataserver.post(Globals.erproute + "saveFeesCollection", req)
    }

    getFeesCollection(req: any) {
        return this._dataserver.post(Globals.erproute + "getFeesCollection", req)
    }
}