import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PassengerService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    savePassengerInfo(req: any) {
        return this._dataserver.post("savePassengerInfo", req)
    }

    getPassengerDetails(req: any) {
        return this._dataserver.post("getPassengerDetails", req)
    }

    getPassengerReports(req: any) {
        return this._dataserver.post("getPassengerReports", req)
    }
}