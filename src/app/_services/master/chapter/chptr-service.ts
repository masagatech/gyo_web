import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ChapterService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getChapterDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getChapterDetails", req)
    }

    saveChapterInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveChapterInfo", req)
    }
}