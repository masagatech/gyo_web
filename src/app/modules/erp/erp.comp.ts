import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'erp.comp.html'
})

export class ERPComponent implements OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    wsname: string = "";
    wslogo: string = "";
    enttname: string = "";

    global = new Globals();

    constructor(private _router: Router, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get('_schsession_') == null && Cookie.get('_schsession_') == undefined) {
            this._router.navigate(['/login']);
        }

        if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
            this._router.navigate(['/admin/workspace']);
        }

        if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
            this._router.navigate(['/workspace/entity']);
        }

        this.getHeaderDetails();
    }

    public ngOnInit() {

    }

    getHeaderDetails() {
        if (Cookie.get('_schenttdetails_') != null) {
            this.wsname = this._enttdetails.enttname;
            this.wslogo = this.global.uploadurl + this._enttdetails.schlogo;
            this.enttname = this._enttdetails.wsname;
        }
        else {
            this.wsname = this.loginUser.enttname;
            this.wslogo = this.global.uploadurl + this.loginUser.schlogo;
            this.enttname = this.loginUser.wsname;
        }
    }

    ngOnDestroy() {

    }
}