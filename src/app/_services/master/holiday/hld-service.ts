import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class HolidayService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getHoliday(req: any) {
        return this._dataserver.post("getHoliday", req)
    }

    saveHoliday(req: any) {
        return this._dataserver.post("saveHoliday", req)
    }
}