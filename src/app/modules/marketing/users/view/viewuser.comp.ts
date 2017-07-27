import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService } from '@services';
import { LoginUserModel } from '@models';
import { UserService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewuser.comp.html'
})

export class ViewMarketUserComponent implements OnInit {
    usersDT: any = [];
    loginUser: LoginUserModel;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _userervice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this.viewUserDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewUserDataRights() {
        var that = this;
        that.getUserDetails();
    }

    getUserDetails() {
        var that = this;

        commonfun.loader();

        that._userervice.getUserDetails({ "flag": "market" }).subscribe(data => {
            try {
                that.usersDT = data.data;
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

    public addUserForm() {
        this._router.navigate(['/marketing/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/marketing/user/edit', row.uid]);
    }
}
