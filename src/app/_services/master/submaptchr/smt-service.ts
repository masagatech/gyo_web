import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class SubjectMapToTeacherService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getSubjectMapToTeacher(req: any) {
        return this._dataserver.post(Globals.erproute + "getSubjectMapToTeacher", req)
    }

    saveSubjectMapToTeacher(req: any) {
        return this._dataserver.post(Globals.erproute + "saveSubjectMapToTeacher", req)
    }
}