import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ClassService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Standard

    getStandardDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getStandardDetails", req)
    }

    saveStandardInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveStandardInfo", req)
    }

    // Class

    getClassDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getClassDetails", req)
    }

    saveClassInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveClassInfo", req)
    }
}