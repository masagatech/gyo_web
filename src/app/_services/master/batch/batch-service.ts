import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class BatchService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getBatchDetails(req: any) {
        return this._dataserver.post("getBatchDetails", req)
    }

    saveBatchInfo(req: any) {
        return this._dataserver.post("saveBatchInfo", req)
    }
}