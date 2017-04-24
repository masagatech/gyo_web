import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class OwnerService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOwnerDetails(req: any) {
        return this._dataserver.post("getOwnerDetails", req)
    }

    saveOwnerInfo(req: any) {
        return this._dataserver.post("saveOwnerInfo", req)
    }
}