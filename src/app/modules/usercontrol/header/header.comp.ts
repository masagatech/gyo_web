import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event as NavigationEvent } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, AuthenticationService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AppState } from '../../../app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var loader: any;

@Component({
  selector: '<app-head></app-head>',
  templateUrl: 'header.comp.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _wsdetails: any = [];
  wsname: string = "";
  wslogo: string = "";
  userfullname: string = "";

  mname: string = "";

  global = new Globals();
  uploadconfig = { server: "", serverpath: "", uploadurl: "", method: "post", maxFilesize: "", acceptedFiles: "" };

  reportsMenuDT: any = [];

  private themes: any = [
    { nm: 'red', disp: 'Red' },
    { nm: 'pink', disp: 'pink' },
    { nm: 'purple', disp: 'purple' },
    { nm: 'deep-purple', disp: 'Deep Purple' },
    { nm: 'indigo', disp: 'indigo' },
    { nm: 'blue', disp: 'blue' },
    { nm: 'light-blue', disp: 'Light Blue' },
    { nm: 'cyan', disp: 'cyan' },
    { nm: 'teal', disp: 'teal' },
    { nm: 'green', disp: 'green' },
    { nm: 'light-green', disp: 'Light Green' },
    { nm: 'lime', disp: 'lime' },
    { nm: 'yellow', disp: 'yellow' },
    { nm: 'amber', disp: 'amber' },
    { nm: 'orange', disp: 'orange' },
    { nm: 'deep-orange', disp: 'deep-orange' },
    { nm: 'brown', disp: 'brown' },
    { nm: 'grey', disp: 'grey' },
    { nm: 'blue-grey', disp: 'blue-grey' },
    { nm: 'black', disp: 'black' }
  ];

  constructor(private _authservice: AuthenticationService, public _menuservice: MenuService, private _loginservice: LoginService,
    private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
    this.loginUser = this._loginservice.getUser();
    this._wsdetails = Globals.getWSDetails();

    this.userfullname = this.loginUser.fullname + " (" + this.loginUser.utypename + ")";
    this.getHeaderDetails();
    this.getChildMenuList();

    _router.events.forEach((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        commonfun.loader();
      }

      if (event instanceof NavigationEnd) {
        commonfun.loaderhide();
      }

      if (event instanceof NavigationError) {
        commonfun.loaderhide();
      }

      if (event instanceof NavigationCancel) {
        commonfun.loaderhide();
      }
    });
  }

  getHeaderDetails() {
    this.wsname = this._wsdetails.wsname;
    this.wslogo = this.global.uploadurl + this._wsdetails.wslogo;
  }

  ngOnInit() {

  }

  public ngAfterViewInit() {
    loader.loadall();
  }

  public getChildMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({
      "flag": "child", "uid": that.loginUser.uid, "issysadmin": that.loginUser.issysadmin, "utype": that.loginUser.utype
    }).subscribe(data => {
      that.reportsMenuDT = data.data;
    }, err => {
      that._msg.Show(messageType.error, "Error", err);
    }, () => {
    })
  }

  private changeSkin(theme: any) {
    loader.skinChanger(theme);
  }

  openWorkspaceForm() {
    Cookie.delete("_enttid_");
    Cookie.delete("_enttnm_");
    Cookie.delete("_wsdetails_");
    this._router.navigate(['/workspace']);
  }

  logout() {
    this._authservice.logout();
  }

  ngOnDestroy() {

  }
}