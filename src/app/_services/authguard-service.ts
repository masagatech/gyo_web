import { Injectable, Inject } from '@angular/core';
import { CanActivate, CanLoad, CanActivateChild } from '@angular/router';
import { AuthenticationService } from '../_services/auth-service';
import { LoginService } from '../_services/login/login-service'
import { GlobalSharedVariableService } from '../_services/sharedvariableglobal-service'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private authser: AuthenticationService, private _loginservice: LoginService, private _router: Router) {

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
    var routeconfig = route.data;
    var checks = this.authser.checkCredentials();
    var that = this;

    return Observable.create((observer: Subject<boolean>) => {
      if (checks.status) {
        that.checkMenuAccess(route, state, that._loginservice.getUser(), function (e) {
          if (e) {
            observer.next(true);
          } else {
            that._router.navigate(['/no-page']);
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
                that._router.navigate(['/no-page']);
                observer.next(true);
              }
            });
          } else {
            that._router.navigate(['login']);
            observer.next(true);
          }
        }, checks);
      } else {
        this._router.navigate(['login']);
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
        "uid": userdetails.uid,
        "ucode": userdetails.ucode,
        "utype": userdetails.utype,
        "issysadmin": userdetails.issysadmin,
        "ptype": "p",
        "mcode": submodule,
        "actcd": rights,
        "sessionid": userdetails.sessiondetails.sessionid,
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