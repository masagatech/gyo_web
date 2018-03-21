import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';
import { Globals } from '@globals';

@Injectable()
export class MilegeService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getMilegeDetails(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getMilegeDetails", req)
    }
}