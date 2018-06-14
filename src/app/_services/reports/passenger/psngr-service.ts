import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class PassengerReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getPassengerReports(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getPassengerReports", req)
    }

    // Save Certificate

    saveCertificateInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveCertificateInfo", req)
    }

    getStudentCertificate(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getStudentCertificate", req)
    }
}