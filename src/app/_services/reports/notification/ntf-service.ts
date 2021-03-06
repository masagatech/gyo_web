import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class NotificationService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getNotification(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getNotification", req)
    }
}