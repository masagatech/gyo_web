import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ClassService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getClassDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getClassDetails", req)
    }

    saveClassInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveClassInfo", req)
    }
}