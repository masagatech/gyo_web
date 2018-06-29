import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PassengerService {
    constructor(private _dataserver: DataService, private _router: Router) { }
}