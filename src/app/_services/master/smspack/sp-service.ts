import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class SMSPackService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getSMSPack(req: any) {
        return this._dataserver.post(Globals.erproute + "getSMSPack", req)
    }

    saveSMSPack(req: any) {
        return this._dataserver.post(Globals.erproute + "saveSMSPack", req)
    }
}