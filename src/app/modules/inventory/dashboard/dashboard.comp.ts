import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'dashboard.comp.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    dashboardDT: any = [];

    constructor(private _loginservice: LoginService, private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    ngOnInit() {

    }

    public ngOnDestroy() {

    }
}