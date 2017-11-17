import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ProspectusService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewprspct.comp.html',
    providers: [CommonService]
})

export class ViewProspectusComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    prospectusDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _prspctservice: ProspectusService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYDropDown();
    }

    public ngOnInit() {

    }

    // Fill Academic Year Down

    fillAYDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._prspctservice.getProspectusDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data;

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].ayid;
                        that.getProspectusDetails();
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

    getProspectusDetails() {
        var that = this;
        commonfun.loader();

        that._prspctservice.getProspectusDetails({
            "flag": "all", "ayid": that.ayid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
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
        this._router.navigate(['/admission/prospectus/add']);
    }

    public editProspectus(row) {
        this._router.navigate(['/admission/prospectus/edit', row.prspctid]);
    }
}
