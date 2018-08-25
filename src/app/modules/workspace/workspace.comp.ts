import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

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
    homeurl: string = "";

    global = new Globals();

    constructor(private _router: Router, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get("_schsession_") == null && Cookie.get("_schsession_") == undefined) {
            this._router.navigate(['/login']);
        }

        if (this.loginUser.ismenurights) {
            if (sessionStorage.getItem("_schwsdetails_") == null && sessionStorage.getItem("_schwsdetails_") == undefined) {
                this._router.navigate(['/admin/workspace']);
            }

            this.getHeaderDetails();
        }
        else {
            this._router.navigate(['/admin/nopage']);
        }
    }

    public ngOnInit() {

    }

    getHeaderDetails() {
        if (sessionStorage.getItem("_schenttdetails_") == null && sessionStorage.getItem("_schenttdetails_") == undefined) {
            if (sessionStorage.getItem("_schwsdetails_") == null && sessionStorage.getItem("_schwsdetails_") == undefined) {
                this.wsname = this.loginUser.wsname;
                this.enttname = "";
                this.wslogo = this.global.uploadurl + this.loginUser.wslogo;
                this.homeurl = "/admin/workspace";
            }
            else {
                this.wsname = this._wsdetails.wsname;
                this.enttname = this.loginUser.wsname;
                this.wslogo = this.global.uploadurl + this._wsdetails.wslogo;
                this.homeurl = "/workspace/entity";
            }
        }
        else {
            this.wsname = this._enttdetails.enttname;
            this.enttname = this._enttdetails.wsname;
            this.wslogo = this.global.uploadurl + this._enttdetails.wslogo;
            this.homeurl = "/workspace/entity";
        }
    }

    ngOnDestroy() {

    }
}