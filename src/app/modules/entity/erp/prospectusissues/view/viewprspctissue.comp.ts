import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ProspectusService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewprspctissue.comp.html',
    providers: [CommonService]
})

export class ViewProspectusIssuesComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    prospectusDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _assmservice: ProspectusService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getProspectusDetails();
    }

    public ngOnInit() {

    }

    getProspectusDetails() {
        var that = this;
        commonfun.loader();

        that._assmservice.getProspectusDetails({
            "flag": "all", "enttid": that._enttdetails.enttid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.prospectusDT = data.data;
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

    public addProspectus() {
        this._router.navigate(['/transaction/prospectus/add']);
    }

    public editProspectus(row) {
        this._router.navigate(['/transaction/prospectus/edit', row.prspctid]);
    }
}
