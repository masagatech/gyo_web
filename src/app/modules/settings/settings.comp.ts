import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'settings.comp.html'
})

export class SettingsComponent implements OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    wsname: string = "";
    wslogo: string = "";
    enttname: string = "";

    constructor(private _router: Router) {
        let _enttdetails = Cookie.get("_schenttdetails_");

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
        if (Cookie.get('_schenttdetails_') != null) {
            this.wsname = this._enttdetails.enttname;
            this.wslogo = this.global.uploadurl + this._enttdetails.schlogo;
            this.enttname = this._wsdetails.wsname;
        }
    }

    ngOnDestroy() {

    }
}