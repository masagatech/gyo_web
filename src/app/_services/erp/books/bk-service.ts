import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class BookService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getBooksDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getBooksDetails", req)
    }

    saveBooksInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveBooksInfo", req)
    }
}