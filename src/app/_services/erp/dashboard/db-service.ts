import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ERPDashboardService {
    constructor(private _dataserver: DataService, private _router: Router) { }
}