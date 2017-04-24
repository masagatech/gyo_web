import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAutoData(req: any) {
        return this._dataserver.get("getAutoData", req)
    }

    getMOM(req: any) {
        return this._dataserver.post("getMOM", req)
    }

    saveMOM(req: any) {
        return this._dataserver.post("saveMOM", req)
    }
}