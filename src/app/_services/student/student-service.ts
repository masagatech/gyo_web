import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class StudentService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveStudentInfo(req: any) {
        return this._dataserver.post("saveStudentInfo", req)
    }

    getStudentGrid(req: any) {
        return this._dataserver.post("getStudentGrid", req)
    }

    getStudentDetail(req: any) {
        return this._dataserver.post("getStudentDetail", req)
    }
}