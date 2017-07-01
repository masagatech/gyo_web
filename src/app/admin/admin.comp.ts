import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AuthenticationService } from '../_services/auth-service';
import { LoginService } from '@services';
import { LoginUserModel } from '@models';

declare var $: any;
declare var loader: any;

@Component({
  templateUrl: 'admin.comp.html'
})

export class AdminComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  dispname: string = "";

  constructor(private _router: Router, private _authservice: AuthenticationService, private _loginservice: LoginService) {
    this.loginUser = this._loginservice.getUser();
    this.dispname = this.loginUser.dispname;

    let sessionid = Cookie.get('_session_');
    let _wsdetails = Cookie.get("_wsdetails_");

    if (sessionid == null && sessionid == undefined) {
      this._router.navigate(['/login']);
    }
  }

  ngOnInit() {

  }

  public ngAfterViewInit() {
    loader.loadall();
  }

  logout() {
    this._authservice.logout();
  }

  ngOnDestroy() {

  }
}