import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getDropDownData(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "getDropDownData", req)
    }

    getAutoData(req: any) {
        return this._dataserver.get(Globals.mrchtroute + "getAutoData", req)
    }
}