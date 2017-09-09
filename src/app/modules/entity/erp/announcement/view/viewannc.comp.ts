import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AnnouncementService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewannc.comp.html',
    providers: [CommonService]
})

export class ViewAnnouncementComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];
    
    announcementDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ntfservice: AnnouncementService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAnnouncement();
    }

    public ngOnInit() {

    }

    // Announcement

    getAnnouncement() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getAnnouncement({
            "flag": "all", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "ntftype":"standard"
        }).subscribe(data => {
            try {
                that.announcementDT = data.data;
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

    public addAnnouncement() {
        this._router.navigate(['/erp/announcement/add']);
    }

    public editAnnouncement(row) {
        this._router.navigate(['/erp/announcement/edit', row.ntfid]);
    }
}
