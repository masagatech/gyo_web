import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class TrackDashbord {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getvahicleupdates(req: any) {
        return this._dataserver.post("tripapi/getvahicleupdates", req)
    }

    gettrackboard(req: any) {
        return this._dataserver.post("tripapi/gettrackboard", req)
    }
}