import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event as NavigationEvent } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, AuthenticationService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AppState } from '../../../app.service';
import { EntityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var loader: any;

@Component({
  selector: '<app-head></app-head>',
  templateUrl: 'header.comp.html',
  providers: [EntityService, MenuService]
})

export class HeaderComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _enttdetails: any = [];

  entityDT: any = [];

  ufullname: string = "";
  utype: string = "";
  uphoto: string = "";

  @Input() wsname: string = "";
  @Input() wslogo: string = "";
  @Input() enttname: string = "";
  @Input() homeurl: string = "";

  iserpmenu: boolean = false;
  ismstmenu: boolean = false;
  isrptmenu: boolean = false;

  mname: string = "";

  global = new Globals();
  uploadconfig = { server: "", serverpath: "", uploadurl: "", method: "post", maxFilesize: "", acceptedFiles: "" };

  mastersMenuDT: any = [];
  settingsMenuDT: any = [];
  erpMenuDT: any = [];
  reportsMenuDT: any = [];
  erpReportsMenuDT: any = [];
  adminMenuDT: any = [];

  wsautoid: number = 0;
  enttid: number = 0;
  entttype: string = "";
  psngrtype: string = "";

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
    private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _entityservice: EntityService) {
    this.loginUser = this._loginservice.getUser();
    this._enttdetails = Globals.getEntityDetails();

    this.getHeaderDetails();
    this.getTopMenuList();

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

  ngOnInit() {
  }

  public ngAfterViewInit() {
    loader.loadall();
  }

  getHeaderDetails() {
    this.ufullname = this.loginUser.fullname;
    this.utype = this.loginUser.utypename;
    this.uphoto = this.global.uploadurl + this.loginUser.uphoto;

    if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
      this.wsautoid = this.loginUser.wsautoid;
      this.enttid = this.loginUser.enttid;
      this.entttype = this.loginUser.entttype;

      if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
        this.ismstmenu = false;
        this.iserpmenu = false;
        this.isrptmenu = false;
      }
      else {
        this.ismstmenu = true;
        this.iserpmenu = false;
        this.isrptmenu = false;
      }
    }
    else {
      this.wsautoid = this._enttdetails.wsautoid;
      this.enttid = this._enttdetails.enttid;
      this.entttype = this._enttdetails.entttype;

      this.ismstmenu = true;
      this.iserpmenu = true;
      this.isrptmenu = true;
    }
  }

  public getTopMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({
      "flag": "topmenu", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "psngrtype": that._enttdetails.psngrtype,
      "entttype": that.entttype, "enttid": that.enttid, "wsautoid": that.wsautoid, "issysadmin": that.loginUser.issysadmin
    }).subscribe(data => {
      that.mastersMenuDT = data.data.filter(a => a.mptype === "master");
      that.settingsMenuDT = data.data.filter(a => a.mptype === "settings");
      that.erpMenuDT = data.data.filter(a => a.mptype === "erp");
      that.reportsMenuDT = data.data.filter(a => a.mptype === "reports");
      that.erpReportsMenuDT = data.data.filter(a => a.mptype === "erprpt");
      that.adminMenuDT = data.data.filter(a => a.mptype === "admin");
    }, err => {
      that._msg.Show(messageType.error, "Error", err);
    }, () => {
    })
  }

  private changeSkin(theme: any) {
    loader.skinChanger(theme);
  }

  logout() {
    this._authservice.logout();
  }

  ngOnDestroy() {

  }
}