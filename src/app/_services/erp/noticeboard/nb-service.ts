import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class NoticeboardService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getNoticeboard(req: any) {
        return this._dataserver.post(Globals.erproute + "getNoticeboard", req)
    }

    saveNoticeboard(req: any) {
        return this._dataserver.post(Globals.erproute + "saveNoticeboard", req)
    }
}