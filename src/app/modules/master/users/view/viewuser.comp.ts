import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewuser.comp.html'
})

export class ViewUserComponent implements OnInit {
    usersDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _userervice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this.viewUserDataRights();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewUserDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "usr", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getUserDetails();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        if (that.actviewrights === "view") {
            commonfun.loader();
            
            uparams = { "flag": "all", "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "wsautoid": that._wsdetails.wsautoid };

            that._userervice.getUserDetails(uparams).subscribe(data => {
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
    }

    public addUserForm() {
        this._router.navigate(['/master/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/master/user/edit', row.uid]);
    }
}
