import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class CompanyService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getCompanyDetails(req: any) {
        return this._dataserver.post("getCompanyDetails", req)
    }

    saveCompanyInfo(req: any) {
        return this._dataserver.post("saveCompanyInfo", req)
    }
}