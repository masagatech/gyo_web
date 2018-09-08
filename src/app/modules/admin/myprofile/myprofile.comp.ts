import { Component, OnInit } from '@angular/core';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';

declare var $: any;

@Component({
    templateUrl: 'myprofile.comp.html'
})

export class MyProfileComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    uid: number = 0;
    usersDT: any = [];

    constructor(private _msg: MessageService, private _loginservice: LoginService, private _userservice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getUserDetails();
    }

    public ngOnInit() {
        
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        commonfun.loader();

        uparams = {
            "flag": "myprofile", "uid": that.loginUser.uid, "utype": that.loginUser.utype
        };

        that._userservice.getUserDetails(uparams).subscribe(data => {
            try {
                that.usersDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#users");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#users");
        }, () => {

        })
    }
}
