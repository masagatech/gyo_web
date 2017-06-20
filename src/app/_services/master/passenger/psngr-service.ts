import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PassengerService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getPassengerDetails(req: any) {
        return this._dataserver.post("getStudentDetails", req)
    }

    savePassengerInfo(req: any) {
        return this._dataserver.post("saveStudentInfo", req)
    }
}