import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MessageService } from "./_services/messages/message-service";
import { Message } from 'primeng/primeng';
import { AppState } from './app.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

declare var loader: any;

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.component.html'
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

  constructor(public appState: AppState, _messageServ: MessageService, private _routeParams: ActivatedRoute, private _router: Router) {
    this.subscription = _messageServ.notificationReceiver$.subscribe(_messagestack => {
      this.messagestack.push({
        severity: _messagestack.severity, detail: _messagestack.detail, summary: _messagestack.summary
      });
    });
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    loader.loadall();
  }

  private changeSkin(theme: any) {
    loader.skinChanger(theme);
  }
}