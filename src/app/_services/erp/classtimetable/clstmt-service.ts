import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ClassTimeTableService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveClassTimeTable(req: any) {
        return this._dataserver.post(Globals.erproute + "saveClassTimeTable", req)
    }

    getClassTimeTable(req: any) {
        return this._dataserver.post(Globals.erproute + "getClassTimeTable", req)
    }

    saveTimeTable(req: any) {
        return this._dataserver.post(Globals.erproute + "saveTimeTable", req)
    }

    getTimeTable(req: any) {
        return this._dataserver.post(Globals.erproute + "getTimeTable", req)
    }
}