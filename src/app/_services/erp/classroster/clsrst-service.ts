import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ClassRosterService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getClassRoster(req: any) {
        return this._dataserver.post(Globals.erproute + "getClassRoster", req)
    }
}