import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'inventory.comp.html'
})

export class InventoryComponent implements OnDestroy {
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

        if (Cookie.get('_schsession_') == null && Cookie.get('_schsession_') == undefined) {
            this._router.navigate(['/login']);
        }

        if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
            this._router.navigate(['/admin/workspace']);
        }

        this.getHeaderDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    getHeaderDetails() {
        if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
            if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}