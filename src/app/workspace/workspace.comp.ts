import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'workspace.comp.html'
})

export class WorkspaceComponent implements OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    wsname: string = "";
    wslogo: string = "";
    enttname: string = "";

    global = new Globals();

    constructor(private _router: Router, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get('_schsession_') == null && Cookie.get('_schsession_') == undefined) {
            this._router.navigate(['/login']);
        }

        if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
            this._router.navigate(['/admin/workspace']);
        }

        this.getHeaderDetails();
    }

    public ngOnInit() {

    }

    getHeaderDetails() {
        if (Cookie.get('_schwsdetails_') != null) {
            this.wsname = this._wsdetails.wsname;
            this.wslogo = this.global.uploadurl + this._wsdetails.wslogo;
            this.enttname = Cookie.get('_schenttdetails_') != null ? this._enttdetails.enttname : "";
        }
    }

    ngOnDestroy() {

    }
}