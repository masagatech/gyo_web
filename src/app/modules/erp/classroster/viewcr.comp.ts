import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewcr.comp.html',
    providers: [CommonService]
})

export class ClassRosterComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];
    
    notificationDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsservice: ClassService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getClassDetails();
    }

    public ngOnInit() {

    }

    // Notification

    getClassDetails() {
        var that = this;
        commonfun.loader();

        that._clsservice.getClassDetails({
            "flag": "all", "wsautoid": that._enttdetails.wsautoid, "enttid": that._enttdetails.enttid, "ntftype":"standard"
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
}
