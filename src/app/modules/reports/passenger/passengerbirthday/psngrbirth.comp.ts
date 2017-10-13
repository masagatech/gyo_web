import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'psngrbirth.comp.html',
    providers: [CommonService]
})

export class PassengerBirthdayComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    birthdayDT: any = [];

    global = new Globals();

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _psngrservice: PassengerService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getBirthday();
    }

    public ngOnInit() {

    }

    getBirthday() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "birthday", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that._enttdetails.issysadmin,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        that._psngrservice.getPassengerDetails(params).subscribe(data => {
            try {
                that.birthdayDT = data.data;
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
