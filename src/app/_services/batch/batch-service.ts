import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class BatchService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveBatchInfo(req: any) {
        return this._dataserver.post("saveBatchInfo", req)
    }

    getBatchGrid(req: any) {
        return this._dataserver.post("getBatchGrid", req)
    }

    getBatchDetail(req: any) {
        return this._dataserver.post("getBatchDetail", req)
    }
}