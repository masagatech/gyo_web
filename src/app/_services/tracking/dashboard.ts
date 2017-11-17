import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';
import { Globals } from '@globals';

@Injectable()
export class TrackDashbord {
    global = new Globals();
    constructor(private _dataserver: DataService, private _router: Router) { }


    getvahicleupdates(req: any) {
        return this._dataserver.post("tripapi/getvahicleupdates", req)
    }

    gettrackboard(req: any) {
        return this._dataserver.post("tripapi/gettrackboard", req)
    }

    gettrackboardHistory(req: any) {
        return this._dataserver.post("tripapi/getHistory", req)
    }

    gettrackboardHistoryPost_trk(req: any) {
        return this._dataserver.otherpost(this.global.trackurl_trk + "tripapi/getHistory", req)
    }

    getvahicleupdates_trk(req: any) {
        return this._dataserver.otherpost(this.global.trackurl_trk + "tripapi/getvahicleupdates", req)
    }
}   