import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class LeaveService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveLeaveInfo(req: any) {
        return this._dataserver.post("savePassengerLeave", req)
    }

    saveLeaveApproval(req: any) {
        return this._dataserver.post("savePassengerLeaveApproval", req)
    }

    getLeaveDetails(req: any) {
        return this._dataserver.post("getPassengerLeave", req)
    }

    exportLeaveDetails(req: any) {
        return this._dataserver.post("exportPassengerLeave", req)
    }

    getLeaveReports(req: any) {
        return this._dataserver.post("getLeaveReports", req)
    }
}