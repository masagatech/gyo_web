import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ActivityService } from '@services/master';

@Component({
    templateUrl: 'viewactv.comp.html',
    providers: [CommonService]
})

export class ViewActivityComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];
    
    activityDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _actvservice: ActivityService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getActivityDetails();
    }

    public ngOnInit() {

    }

    // Subject

    getActivityDetails() {
        var that = this;
        commonfun.loader();

        that._actvservice.getActivityDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                that.activityDT = data.data;
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

    public addActivity() {
        this._router.navigate(['/master/activity/add']);
    }

    public editActivity(row) {
        this._router.navigate(['/master/activity/edit', row.actvid]);
    }
}
