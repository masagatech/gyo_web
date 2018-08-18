import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AnnouncementService } from '@services/erp';

@Component({
    templateUrl: 'viewannc.comp.html'
})

export class ViewAnnouncementComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];
    
    announcementDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _ntfservice: AnnouncementService) {
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
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ntftype":"standard", "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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
        this._router.navigate(['/communication/announcement/add']);
    }

    public editAnnouncement(row) {
        this._router.navigate(['/communication/announcement/edit', row.ntfid]);
    }
}
