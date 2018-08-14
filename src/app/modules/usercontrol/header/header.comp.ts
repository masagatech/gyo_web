import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event as NavigationEvent } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, AuthenticationService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var loader: any;

@Component({
  selector: '<app-head></app-head>',
  templateUrl: 'header.comp.html',
  providers: [MenuService, CommonService]
})

export class HeaderComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _enttdetails: any = [];

  autoMenuDT: any = [];
  mid: number = 0;
  mname: any = [];

  ufullname: string = "";
  ctypename: string = "";
  gender: string = "";
  uphoto: string = "";

  @Input() wsname: string = "";
  @Input() wslogo: string = "";
  @Input() enttname: string = "";
  @Input() homeurl: string = "";

  isenttmenu: boolean = false;
  ismstmenu: boolean = false;
  isrptmenu: boolean = false;
  isalmenu: boolean = false;

  erpmname: string = "";
  rptmname: string = "";
  mstmname: string = "";
  admmname: string = "";

  global = new Globals();

  enttMenuDT: any = [];
  reportsMenuDT: any = [];
  mastersMenuDT: any = [];
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

  constructor(private _router: Router, private _authservice: AuthenticationService, public _menuservice: MenuService, private _autoservice: CommonService,
    private _loginservice: LoginService, private _msg: MessageService) {
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

  openHelpDeskDashboard() {
    Cookie.delete("_studdata_");
    Cookie.delete("_vehdata_");
    Cookie.delete("_userdata_");

    this._router.navigate(['/admin/helpdesk'], {
      queryParams: { "flag": "student" }
    });
  }

  public ngAfterViewInit() {
    loader.loadall();
  }

  // Auto Completed Menus

  getAutoMenuData(event) {
    var that = this;

    let query = event.query;

    that._autoservice.getAutoData({
      "flag": "menu",
      "uid": that.loginUser.uid,
      "utype": that.loginUser.utype,
      "psngrtype": that._enttdetails.psngrtype,
      "entttype": that.entttype,
      "enttid": that.enttid,
      "wsautoid": that.wsautoid,
      "issysadmin": that.loginUser.issysadmin,
      "search": query
    }).subscribe((data) => {
      that.autoMenuDT = data.data;
    }, err => {
      that._msg.Show(messageType.error, "Error", err);
    }, () => {

    });
  }

  // Selected Menus

  selectEntityData(event) {
    this.mid = event.value;
    this.mname = event.label;
  }

  getHeaderDetails() {
    this.ufullname = this.loginUser.fullname;
    this.ctypename = this.loginUser.ctypename;
    this.gender = this.loginUser.gndrkey;
    this.uphoto = this.global.uploadurl + this.loginUser.uphoto;

    if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
      this.wsautoid = this.loginUser.wsautoid;
      this.enttid = this.loginUser.enttid;
      this.entttype = this.loginUser.entttype;

      if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
        this.ismstmenu = false;
        this.isenttmenu = false;
        this.isrptmenu = false;
        this.isalmenu = false;
      }
      else {
        this.ismstmenu = true;
        this.isenttmenu = false;
        this.isrptmenu = false;
        this.isalmenu = true;
      }
    }
    else {
      this.wsautoid = this._enttdetails.wsautoid;
      this.enttid = this._enttdetails.enttid;
      this.entttype = this._enttdetails.entttype;

      this.ismstmenu = true;
      this.isenttmenu = true;
      this.isrptmenu = true;
      this.isalmenu = true;
    }
  }

  public getTopMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({
      "flag": "topmenu", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "psngrtype": that._enttdetails.psngrtype,
      "entttype": that.entttype, "enttid": that.enttid, "wsautoid": that.wsautoid, "issysadmin": that.loginUser.issysadmin
    }).subscribe(data => {
      that.enttMenuDT = data.data.filter(a => a.mptype === "erp");
      that.reportsMenuDT = data.data.filter(a => a.mptype === "reports");
      that.mastersMenuDT = data.data.filter(a => a.mptype === "master");
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