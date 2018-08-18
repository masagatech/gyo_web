import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'entity.comp.html'
})

export class EntityComponent implements OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    enttname: string = "";
    wsname: string = "";
    wslogo: string = "";

    global = new Globals();

    constructor(private _router: Router, private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get("_schsession_") == null && Cookie.get("_schsession_") == undefined) {
            this._router.navigate(['/login']);
        }

        if (sessionStorage.getItem("_schenttdetails_") == null && sessionStorage.getItem("_schenttdetails_") == undefined) {
            this._router.navigate(['/workspace/entity']);
        }
        
        this.getHeaderDetails();
    }

    public ngOnInit() {

    }

    getHeaderDetails() {
        if (sessionStorage.getItem("_schenttdetails_") != null) {
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