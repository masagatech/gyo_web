import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { AuthenticationService } from '../../../_services/auth-service'
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { Globals } from '../../../_const/globals';

declare var $: any;

@Component({
    selector: '<leftsidebar></leftsidebar>',
    templateUrl: 'leftsidebar.comp.html'
})

export class LeftSideBarComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    userfullname: string = "";
    usertype: string = "";
    userphoto: string = "";
    wsname: string = "";
    toggleClass: string = "";

    mainMenuDT: any = [];
    parentMenuDT: any = [];

    constructor(private _authservice: AuthenticationService, public _menuservice: MenuService, private _loginservice: LoginService,
        private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.userfullname = this.loginUser.fullname;
        this.usertype = this.loginUser.utype;
        this.userphoto = this.loginUser.uphoto;
        this.wsname = this.loginUser.wsname;

        this.getMainMenuList();
        this.getParentMenuList();
        
        this._wsdetails = Globals.getWSDetails();
    }

    ngOnInit() {

    }

    public getMainMenuList() {
        var that = this;

        that._menuservice.getMenuDetails({
            "flag": "main", "uid": that.loginUser.uid, "issysadmin": that.loginUser.issysadmin, "utype": that.loginUser.utype
        }).subscribe(data => {
            that.mainMenuDT = data.data;

            setTimeout(function () {
                $.AdminBSB.leftSideBar.activate();
            }, 100);
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    public getParentMenuList() {
        var that = this;

        that._menuservice.getMenuDetails({
            "flag": "parent", "uid": that.loginUser.uid, "issysadmin": that.loginUser.issysadmin, "utype": that.loginUser.utype
        }).subscribe(data => {
            that.parentMenuDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    openMainMenu(row) {
        var that = this;

        if (row.mlink !== null) {
            that._router.navigate(['/' + row.mlink]);
        }
        else {
            row.pMenuDT = that.parentMenuDT.filter(a => a.pid === row.mid);
        }
    }

    logout() {
        this._authservice.logout();
    }

    ngOnDestroy() {

    }
}