import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ChapterService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewchptr.comp.html',
    providers: [CommonService]
})

export class ViewChapterComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    chapterDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _chptrservice: ChapterService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getChapterDetails();
    }

    public ngOnInit() {

    }

    // Subject

    getChapterDetails() {
        var that = this;
        commonfun.loader();

        that._chptrservice.getChapterDetails({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "subid": 0, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.chapterDT = data.data;
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

    public addSubject() {
        this._router.navigate(['/master/chapter/add']);
    }

    public editSubject(row) {
        this._router.navigate(['/master/chapter/edit', row.chptrid]);
    }
}
