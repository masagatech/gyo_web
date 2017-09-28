import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class TagService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getTagDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getTagDetails", req)
    }

    saveTagInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveTagInfo", req)
    }

    getTagGroupModuleMap(req: any) {
        return this._dataserver.post(Globals.erproute + "getTagGroupModuleMap", req)
    }

    saveTagGroupModuleMap(req: any) {
        return this._dataserver.post(Globals.erproute + "saveTagGroupModuleMap", req)
    }
}