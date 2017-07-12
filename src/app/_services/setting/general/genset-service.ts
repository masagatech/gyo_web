import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class GeneralService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getGeneralSetting(req: any) {
        return this._dataserver.post("getGeneralSetting", req)
    }

    saveGeneralSetting(req: any) {
        return this._dataserver.post("saveGeneralSetting", req)
    }
}