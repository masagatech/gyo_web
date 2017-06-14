import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MenuService } from './_services/menus/menu-service';
import { MessageService } from "./_services/messages/message-service";
import { Message } from 'primeng/primeng';
import { AppState } from './app.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

declare var loader: any;

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.component.html',
  providers: [MenuService]
})

export class AppComponent implements OnInit, AfterViewInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'GOYO Entity';
  public url = 'https://twitter.com/AngularClass';
  subscription: Subscription;
  messagestack: Message[] = [];

  private themes: any = [
    { nm: 'red', disp: 'Red' },
    { nm: 'pink', disp: 'Pink' },
    { nm: 'purple', disp: 'Purple' },
    { nm: 'deep-purple', disp: 'Deep Purple' },
    { nm: 'indigo', disp: 'Indigo' },
    { nm: 'blue', disp: 'Blue' },
    { nm: 'light-blue', disp: 'Light Blue' },
    { nm: 'cyan', disp: 'Cyan' },
    { nm: 'teal', disp: 'Teal' },
    { nm: 'green', disp: 'Green' },
    { nm: 'light-green', disp: 'Light Green' },
    { nm: 'lime', disp: 'Lime' },
    { nm: 'yellow', disp: 'Yellow' },
    { nm: 'amber', disp: 'Amber' },
    { nm: 'orange', disp: 'Orange' },
    { nm: 'deep-orange', disp: 'Deep Orange' },
    { nm: 'brown', disp: 'Brown' },
    { nm: 'grey', disp: 'Grey' },
    { nm: 'blue-grey', disp: 'Blue-Grey' },
    { nm: 'black', disp: 'Black' }
  ];

  mainMenuDT: any = [];
  parentMenuDT: any = [];
  subMenuDT: any = [];

  constructor(public appState: AppState, _messageServ: MessageService, public _menuservice: MenuService,
    private _routeParams: ActivatedRoute, private _router: Router) {

    this.subscription = _messageServ.notificationReceiver$.subscribe(_messagestack => {
      this.messagestack.push({
        severity: _messagestack.severity, detail: _messagestack.detail, summary: _messagestack.summary
      });
    });

    this.getMainMenuList();
    // this.getParentMenuList();
    // this.getSubMenuList();
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    loader.loadall();
  }

  private changeSkin(theme: any) {
    loader.skinChanger(theme);
  }

  public getMainMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({ "flag": "main" }).subscribe(data => {
      that.mainMenuDT = data.data;
    }, err => {
      //that._msg.Show(messageType.error, "Error", err);
    }, () => {

    })
  }

  public getParentMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({ "flag": "parent" }).subscribe(data => {
      that.parentMenuDT = data.data;
    }, err => {
      //that._msg.Show(messageType.error, "Error", err);
    }, () => {

    })
  }

  public getSubMenuList() {
    var that = this;

    that._menuservice.getMenuDetails({ "flag": "sub", "pid": "8" }).subscribe(data => {
      that.subMenuDT = data.data;
    }, err => {
      //that._msg.Show(messageType.error, "Error", err);
    }, () => {

    })
  }

  openMenuForm(row) {
    if (row.mlink !== null) {
      this._router.navigate(['/' + row.mlink]);
    }
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */