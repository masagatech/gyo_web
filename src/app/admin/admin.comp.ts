import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
  templateUrl: 'admin.comp.html'
})

export class AdminComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _wsdetails: any = [];
  _enttdetails: any = [];

  wsname: string = "";
  wslogo: string = "";
  enttname: string = "";

  global = new Globals();

  constructor(private _router: Router, private _loginservice: LoginService) {
    this.loginUser = this._loginservice.getUser();

    if (Cookie.get('_schsession_') == null && Cookie.get('_schsession_') == undefined) {
      this._router.navigate(['/login']);
    }

    this.getHeaderDetails();
  }

  ngOnInit() {

  }

  getHeaderDetails() {
    if (Cookie.get('_schsession_') != null) {
      this.wsname = this.loginUser.wsname;
      this.wslogo = this.global.uploadurl + this.loginUser.wslogo;
      this.enttname = "";
    }
  }

  ngOnDestroy() {

  }
}