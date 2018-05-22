import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AuditLogService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAuditLog(req: any) {
        return this._dataserver.post(Globals.erproute + "getAuditLog", req)
    }

    saveAuditLog(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAuditLog", req)
    }
}