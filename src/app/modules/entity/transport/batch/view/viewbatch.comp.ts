import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { Globals, LoginUserModel } from '@models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BatchService } from '@services/master';

@Component({
    templateUrl: 'viewbatch.comp.html',
    providers: [CommonService]
})

export class ViewBatchComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    batchDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _batchervice: BatchService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getBatchDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $(".entityname input").focus();
        }, 100);
    }

    getBatchDetails() {
        var that = this;

        commonfun.loader();

        that._batchervice.getBatchDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "schid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.batchDT = data.data;
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

    public addBatchForm() {
        this._router.navigate(['/transport/batch/add']);
    }

    public editBatchForm(row) {
        this._router.navigate(['/transport/batch/edit', row.autoid]);
    }
}
