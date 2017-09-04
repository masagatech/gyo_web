import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewntf.comp.html',
    providers: [CommonService]
})

export class ViewNotificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    toUsersDT: any = [];
    toudata: any = [];
    touid: number = 0;
    touname: string = "";
    
    notificationDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ntfservice: NotificationService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.viewNotificationRights();
    }

    public ngOnInit() {

    }

    // Auto Completed User

    getUserData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "usrdrv",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.toUsersDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event) {
        this.touid = event.uid;
        this.touname = event.uname;

        Cookie.set("_touid_", this.touid.toString());
        Cookie.set("_touname_", this.touname);

        this.getNotification();
    }

    // Notification

    public viewNotificationRights() {
        var that = this;

        if (Cookie.get('_touname_') != null) {
            that.touid = parseInt(Cookie.get('_touid_'));
            that.touname = Cookie.get('_touname_');

            that.toudata.uid = that.touid;
            that.toudata.uname = that.touname;

            that.getNotification();
        }
    }

    getNotification() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getNotification({
            "flag": "all", "wsautoid": that._enttdetails.wsautoid, "enttid": that._enttdetails.enttid, "toid": that.touid
        }).subscribe(data => {
            try {
                that.notificationDT = data.data;
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

    public addNotification() {
        this._router.navigate(['/master/notification/add']);
    }

    public editNotification(row) {
        this._router.navigate(['/master/notification/edit', row.ntfid]);
    }
}
