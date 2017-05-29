import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class EntityService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getEntityDetails(req: any) {
        return this._dataserver.post("getSchoolDetails", req)
    }

    saveEntityInfo(req: any) {
        return this._dataserver.post("saveSchoolInfo", req)
    }
}