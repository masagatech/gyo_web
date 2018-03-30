import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewntf.comp.html',
    providers: [CommonService]
})

export class ViewNotificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    notificationDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ntfservice: NotificationService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getNotification();
    }

    public ngOnInit() {

    }

    // Notification

    getNotification() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getNotification({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "sendtype": "", "ntftype": "other", "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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
        this._router.navigate(['/communication/notification/add']);
    }

    public editNotification(row) {
        this._router.navigate(['/communication/notification/edit', row.ntfid]);
    }
}
