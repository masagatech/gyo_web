import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event as NavigationEvent } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../_services/auth-service'
import { MenuService } from '../_services/menus/menu-service';
import { LoginService } from '../_services/login/login-service';
import { LoginUserModel } from '../_model/user_model';
import { AppState } from '../app.service';

declare var loader: any;

@Component({
    templateUrl: 'module.comp.html',
    providers: [MenuService, AuthenticationService]
})

export class ModuleComponent implements OnDestroy {
    userfullname: string = "";
    userphoto: string = "";
    useremail: string = "";
    loginUser: LoginUserModel;

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

    constructor(private _authservice: AuthenticationService, public _menuservice: MenuService, private _loginservice: LoginService,
        private _routeParams: ActivatedRoute, private _router: Router) {

        this.loginUser = this._loginservice.getUser();
        this.userfullname = this.loginUser.fullname;
        this.userphoto = this.loginUser.uphoto;
        this.useremail = this.loginUser.email;

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

        this.getMainMenuList();

        // this.getParentMenuList();
        // this.getSubMenuList();
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {
        console.log('Initial App State view');
        loader.loadall();
    }

    private changeSkin(theme: any) {
        loader.skinChanger(theme);
    }

    public getMainMenuList() {
        var that = this;

        that._menuservice.getMenuDetails({ "flag": "main", "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
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

    logout() {
        this._authservice.logout();
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }
}