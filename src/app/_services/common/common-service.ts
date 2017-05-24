import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getFilePath(req: any) {
        return this._dataserver.get("getFilePath", req)
    }

    getAutoData(req: any) {
        return this._dataserver.get("getAutoData", req)
    }

    getDropDownData(req: any) {
        return this._dataserver.post("getDropDownData", req)
    }

    getDashboard(req: any) {
        return this._dataserver.post("getDashboard", req)
    }

    getMOM(req: any) {
        return this._dataserver.post("getMOM", req)
    }

    saveMOM(req: any) {
        return this._dataserver.post("saveMOM", req)
    }
}