import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'reports.comp.html'
})

export class ReportsComponent implements OnDestroy, OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    wsname: string = "";
    wslogo: string = "";
    enttname: string = "";

    global = new Globals();

    constructor(private _router: Router, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get("_schsession_") == null && Cookie.get("_schsession_") == undefined) {
            this._router.navigate(['/login']);
        }

        if (this.loginUser.ismenurights) {
            if (sessionStorage.getItem("_schenttdetails_") == null && sessionStorage.getItem("_schenttdetails_") == undefined) {
                this._router.navigate(['/workspace/entity']);
            }

            this.getHeaderDetails();
        }
        else {
            this._router.navigate(['/admin/nopage']);
        }
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
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
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}