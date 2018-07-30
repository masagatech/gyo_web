import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MessageService, messageType } from './messages/message-service';
import { AuthenticationService } from './auth-service';
import { LoginService } from './login/login-service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private _router: Router, private authser: AuthenticationService, private _loginservice: LoginService, private _msg: MessageService) {

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkFun(route, state);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkFun(route, state);
  }

  public canLoad() {
    return true;
  }

  private checkFun(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let that = this;

    let routeconfig = route.data;
    let checks = that.authser.checkCredentials();

    return Observable.create((observer: Subject<boolean>) => {
      if (checks.status) {
        that.checkMenuAccess(route, state, that._loginservice.getUser(), function (e) {
          if (e) {
            observer.next(true);
          } else {
            that._msg.Show(messageType.error, "Error", "No Access !!!!");
            that._router.navigate(['/']);
            observer.next(true);
          }
        })
      } else if (checks.takefrmdb) {
        that.authser.getSession(function (e) {
          if (e === "success") {
            that.checkMenuAccess(route, state, that._loginservice.getUser(), function (e) {
              if (e) {
                observer.next(true);
              } else {
                that._msg.Show(messageType.error, "Error", "No Access !!!!");
                that._router.navigate(['/']);
                observer.next(true);
              }
            });
          } else {
            that._router.navigate(['login']);
            observer.next(true);
          }
        }, checks);
      } else {
        that._router.navigate(['login']);
        observer.next(true);
      }
    }).first();
  }

  private checkMenuAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, userdetails, callback) {
    var segments = state.url;
    var maindata = route.data;

    if (maindata.hasOwnProperty("submodule")) {
      var module1 = maindata["module"];
      var rights = maindata["rights"];
      var submodule = maindata["submodule"];

      var params = {
        "loginid": userdetails.loginid,
        "uid": userdetails.uid,
        "ucode": userdetails.ucode,
        "utype": userdetails.utype,
        "ptype": "p",
        "mcode": submodule,
        "actcd": rights,
        "sessionid": userdetails.sessiondetails.sessionid,
        "enttid": userdetails.enttid,
        "wsautoid": userdetails.wsautoid,
        "issysadmin": userdetails.issysadmin,
        "url": segments
      };

      this.authser.checkmenuaccess(params).subscribe(d => {
        if (d.data) {
          if (d.data[0].access) {
            callback(true);
          } else {
            callback(false);
          }
        }
      }, error => {
        callback(false);
      }, () => {

      });
    } else {
      callback(true);
      return;
    }
  }
}