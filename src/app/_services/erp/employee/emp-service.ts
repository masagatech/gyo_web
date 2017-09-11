import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class EmployeeService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getEmployeeDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getEmployeeDetails", req)
    }

    saveEmployeeInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveEmployeeInfo", req)
    }
}