import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event as NavigationEvent } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, AuthenticationService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EntityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var loader: any;

@Component({
  selector: '<app-footer></app-footer>',
  templateUrl: 'footer.comp.html',
  providers: [EntityService, MenuService, CommonService]
})

export class FooterComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _wsdetails: any = [];
  _enttdetails: any = [];

  global = new Globals();

  entityDT: any = [];
  enttid: number = 0;
  enttname: string = "";

  wsautoid: number = 0;

  ayDT: any = [];
  ayid: number = 0;

  @Input() homeurl: string = "";

  isenttmenu: boolean = false;

  enttMenuDT: any = [];

  constructor(private _router: Router, private _authservice: AuthenticationService, public _menuservice: MenuService, private _autoservice: CommonService,
    private _loginservice: LoginService, private _msg: MessageService, private _entityservice: EntityService) {
    this.loginUser = this._loginservice.getUser();
    this._wsdetails = Globals.getWSDetails();
    this._enttdetails = Globals.getEntityDetails();

    this.fillEntityAndAYDropDown();
    this.getHeaderDetails();
  }

  ngOnInit() {

  }

  getHeaderDetails() {
    if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
      this.wsautoid = this.loginUser.wsautoid;
      this.enttid = this.loginUser.enttid;
      this.isenttmenu = false;
    }
    else {
      this.wsautoid = this._enttdetails.wsautoid;
      this.enttid = this._enttdetails.enttid;
      this.isenttmenu = true;
    }
  }

  // Fill Entity And Academic Year DropDown

  fillEntityAndAYDropDown() {
    var that = this;
    var defayDT: any = [];

    commonfun.loader();

    var params = {
      "flag": "ddlfooter", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
      "entttype": that._enttdetails.entttype, "issysadmin": that.loginUser.issysadmin, "schoolid": that._wsdetails.schoolid,
      "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
    }

    that._entityservice.getEntityDetails(params).subscribe(data => {
      try {
        that.entityDT = data.data.filter(a => a.group == "entity");
        that.ayDT = data.data.filter(a => a.group == "ay");

        if (that.ayDT.length > 0) {
          if (Cookie.get("_ayid_") != null) {
            that.ayid = parseInt(Cookie.get("_ayid_"));
          }
          else {
            defayDT = that.ayDT.filter(a => a.iscurrent == true);

            if (defayDT.length > 0) {
              that.ayid = defayDT[0].key;
            }
            else {
              that.ayid = that._enttdetails.ayid;
            }
          }
        }
      }
      catch (e) {
        that._msg.Show(messageType.error, "Error", e);
      }

      commonfun.loaderhide();
    }, err => {
      that._msg.Show(messageType.error, "Error", err);
      console.log(err);
      commonfun.loaderhide();
    }, () => {

    })
  }

  public openMainForm(row) {
    var that = this;

    Cookie.delete("_schenttdetails_");
    Cookie.set("_schenttdetails_", JSON.stringify(row));

    that._router.navigateByUrl("/reload", { skipLocationChange: true }).then(() => {
      that._router.navigate(['/']);
    })
  }

  // Fill Entity Details

  getEntityDetails() {
    var that = this;
    var enttdata = [];
    var enttrow = [];

    commonfun.loader();

    var params = {
      "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
      "entttype": "", "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid,
      "schoolid": that._wsdetails.schoolid, "enttid": 0
    }

    that._entityservice.getEntityDetails(params).subscribe(data => {
      try {
        enttdata = data.data;
        enttrow = enttdata.filter(a => a.enttid == that.enttid)[0];
        that.openMainForm(enttrow);
      }
      catch (e) {
        that._msg.Show(messageType.error, "Error", e);
      }

      commonfun.loaderhide();
    }, err => {
      that._msg.Show(messageType.error, "Error", err);
      console.log(err);
      commonfun.loaderhide();
    }, () => {

    })
  }

  changeEntityDetails() {
    var that = this;
    Cookie.delete("_ayid_");
    that.getEntityDetails();
  }

  changeAYDetails() {
    var that = this;

    Cookie.delete("_ayid_");
    Cookie.set("_ayid_", that.ayid.toString());

    that._router.navigateByUrl("/reload", { skipLocationChange: true }).then(() => {
      that._router.navigate(['/']);
    })
  }

  ngOnDestroy() {

  }
}