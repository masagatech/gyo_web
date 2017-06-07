import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../_services/auth-service';
import { LoginService } from '../_services/login/login-service';
import { LoginUserModel } from '../_model/user_model';

declare var $: any;
declare var loader: any;

@Component({
  templateUrl: 'admin.comp.html'
})

export class AdminComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  dispname: string = "";

  constructor(private _authservice: AuthenticationService, private _loginservice: LoginService) {
    this.loginUser = this._loginservice.getUser();
    this.dispname = this.loginUser.dispname;
  }

  ngOnInit() {

  }

  public ngAfterViewInit() {
    console.log('Initial App State view');
    loader.loadall();
  }

  logout() {
    this._authservice.logout();
  }

  ngOnDestroy() {

  }
}