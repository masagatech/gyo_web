import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ContentService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Content

    getContentDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getContentDetails", req)
    }

    saveContentInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveContentInfo", req)
    }

    saveContentDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "saveContentDetails", req)
    }

    saveContentEntityMap(req: any) {
        return this._dataserver.post(Globals.erproute + "saveContentEntityMap", req)
    }
}