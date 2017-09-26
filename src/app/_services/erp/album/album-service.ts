import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AlbumService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAlbumDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getAlbumDetails", req)
    }

    saveAlbumInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAlbumInfo", req)
    }
}