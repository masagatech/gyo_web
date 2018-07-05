import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ContentService } from '@services/master';

@Component({
    templateUrl: 'viewcntdtls.comp.html'
})

export class ViewContentDetailsComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    standardDT: any = [];
    stdid: number = 0;

    contentDetailsDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _cntservice: ContentService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillStandardDropDown();
        this.getContentDetails();
    }

    public ngOnInit() {

    }

    fillStandardDropDown() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "standard", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.standardDT = data.data;
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

    getContentDetails() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "details", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "subid": 0, "stdid": that.stdid, "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.contentDetailsDT = data.data;
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

    public addContentDetails() {
        this._router.navigate(['/workspace/contentdetails/add']);
    }

    public editContentDetails(row) {
        this._router.navigate(['/workspace/contentdetails/edit', row.cdid]);
    }
}
