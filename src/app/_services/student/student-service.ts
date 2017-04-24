import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class StudentService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getStudentDetails(req: any) {
        return this._dataserver.post("getStudentDetails", req)
    }

    saveStudentInfo(req: any) {
        return this._dataserver.post("saveStudentInfo", req)
    }
}