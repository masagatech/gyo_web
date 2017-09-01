import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'entity.comp.html'
})

export class EntityComponent implements OnDestroy {
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
            this.enttname = this._wsdetails.wsname;
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