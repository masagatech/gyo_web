import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ReceiptBookService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Fees Structure

    saveReceiptBook(req: any) {
        return this._dataserver.post(Globals.erproute + "saveReceiptBook", req)
    }

    getReceiptBook(req: any) {
        return this._dataserver.post(Globals.erproute + "getReceiptBook", req)
    }
}