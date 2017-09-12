import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AssignmentService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAssignmentDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getAssignmentDetails", req)
    }

    saveAssignmentInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAssignmentInfo", req)
    }
}