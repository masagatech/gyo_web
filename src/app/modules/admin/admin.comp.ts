import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  templateUrl: 'admin.comp.html'
})

export class AdminComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _wsdetails: any = [];
  _enttdetails: any = [];

  global = new Globals();

  wsname: string = "";
  wslogo: string = "";
  enttname: string = "";
  homeurl: string = "";

  isleftmenu: boolean = false;

  constructor(private _router: Router, private _loginservice: LoginService) {
    this.loginUser = this._loginservice.getUser();
    this._wsdetails = Globals.getWSDetails();
    this._enttdetails = Globals.getEntityDetails();

    if (Cookie.get("_schsession_") == null && Cookie.get("_schsession_") == undefined) {
      this._router.navigate(['/login']);
    }

    this.getHeaderDetails();
  }

  ngOnInit() {
    setTimeout(function () {
      commonfun.navistyle();

      $.AdminBSB.islocked = true;
      $.AdminBSB.leftSideBar.Close();
      $.AdminBSB.rightSideBar.activate();
    }, 0);
  }

  getHeaderDetails() {
    if (Cookie.get("_schsession_") != null) {
      this.wsname = this.loginUser.wsname;
      this.wslogo = this.global.uploadurl + this.loginUser.wslogo;

      if (sessionStorage.getItem("_schwsdetails_") == null) {
        this.enttname = "";
      }
      else {
        this.enttname = this._wsdetails.wsname;
      }

      if (sessionStorage.getItem("_schenttdetails_") != null) {
        this.isleftmenu = true;
      }
      else {
        this.isleftmenu = false;
      }

      if (this.loginUser.issysadmin) {
        if (sessionStorage.getItem("_schenttdetails_") != null) {
          this.homeurl = "/";
        }
        else {
          this.homeurl = "/admin/workspace";
        }
      }
      else {
        if (sessionStorage.getItem("_schenttdetails_") != null) {
          this.homeurl = "/";
        }
        else {
          this.homeurl = "/workspace/entity";
        }
      }
    }
  }

  ngOnDestroy() {
    $.AdminBSB.islocked = false;
    $.AdminBSB.leftSideBar.Open();
  }
}