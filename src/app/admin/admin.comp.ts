import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, LoginService, AuthenticationService, MenuService } from '@services';
import { LoginUserModel, Globals } from '@models';

declare var $: any;
declare var loader: any;

@Component({
  templateUrl: 'admin.comp.html'
})

export class AdminComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _wsdetails: any = [];

  wsname: string = "";
  wslogo: string = "";

  dispname: string = "";

  global = new Globals();
  uploadconfig = { server: "", serverpath: "", uploadurl: "", method: "post", maxFilesize: "", acceptedFiles: "" };

  mastersMenuDT: any = [];

  constructor(private _router: Router, private _authservice: AuthenticationService, public _menuservice: MenuService,
    private _msg: MessageService, private _loginservice: LoginService) {
    this.loginUser = this._loginservice.getUser();
    this.dispname = this.loginUser.dispname;

    let sessionid = Cookie.get('_session_');
    this._wsdetails = Cookie.get("_wsdetails_");

    if (sessionid == null && sessionid == undefined) {
      this._router.navigate(['/login']);
    }

    this.getHeaderDetails();
    this.getTopMenuList();
  }

  ngOnInit() {

  }

  openWorkspaceForm() {
    Cookie.delete("_enttdetails_");
    Cookie.delete("_wsdetails_");
    this._router.navigate(['/workspace']);
  }

  openEntityForm() {
    // if (this._wsdetails !== null && this._wsdetails !== undefined) {
    //   this._router.navigate(['/entity']);
    // }

    this._router.navigate(['/entity']);
  }

  openUserForm() {
    // if (this._wsdetails !== null && this._wsdetails !== undefined) {
    //   this._router.navigate(['/user']);
    // }

    this._router.navigate(['/user']);
  }

  openLocationForm() {
    // if (this._wsdetails !== null && this._wsdetails !== undefined) {
    //   this._router.navigate(['/location']);
    // }

    this._router.navigate(['/location']);
  }

  getHeaderDetails() {
    this.wsname = this.loginUser.wsname;
    this.wslogo = this.global.uploadurl + this.loginUser.wslogo;
  }

  public getTopMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({
      "flag": "topmenu", "uid": that.loginUser.uid, "issysadmin": that.loginUser.issysadmin, "utype": that.loginUser.utype
    }).subscribe(data => {
      that.mastersMenuDT = data.data.filter(a => a.mptype === "master");
    }, err => {
      that._msg.Show(messageType.error, "Error", err);
    }, () => {
    })
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