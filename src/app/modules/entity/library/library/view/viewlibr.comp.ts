import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewlibr.comp.html',
    providers: [CommonService]
})

export class ViewLibraryComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    libraryDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _clsservice: LibraryService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getLibraryDetails();
    }

    public ngOnInit() {

    }

    getLibraryDetails() {
        var that = this;
        commonfun.loader();

        that._clsservice.getLibraryDetails({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.libraryDT = data.data;
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

    public addLibrary() {
        this._router.navigate(['/master/library/add']);
    }

    public editLibrary(row) {
        this._router.navigate(['/master/library/edit', row.librid]);
    }
}
