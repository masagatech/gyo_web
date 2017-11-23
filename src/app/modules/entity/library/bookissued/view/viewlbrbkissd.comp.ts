import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewlbrbkissd.comp.html',
    providers: [CommonService]
})

export class ViewLibraryBookIssuedComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    bookIssuedDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _librservice: LibraryService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYDropDown();
        this.getLibraryBookIssued();
    }

    public ngOnInit() {

    }

    // Fill Academic Year Down

    fillAYDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._librservice.getLibraryBooks({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                        that.getLibraryBookIssued();
                    }
                    else {
                        that.ayid = 0;
                    }
                }
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

    // Get Book Issued

    getLibraryBookIssued() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBookIssued({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": that.ayid, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.bookIssuedDT = data.data;
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

    public addBookIssued() {
        this._router.navigate(['/master/bookissued/add']);
    }

    public editBookIssued(row) {
        this._router.navigate(['/master/bookissued/edit', row.issdid]);
    }
}
