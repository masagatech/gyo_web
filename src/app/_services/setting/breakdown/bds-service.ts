import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class BreakDownService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getBreakDownSet(req: any) {
        return this._dataserver.post("getBreakDownSet", req)
    }

    saveBreakDownSet(req: any) {
        return this._dataserver.post("SaveBreakDownSet", req)
    }
}