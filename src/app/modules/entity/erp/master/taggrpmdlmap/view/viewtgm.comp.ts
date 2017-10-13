import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TagService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewtgm.comp.html',
    providers: [CommonService]
})

export class ViewTagGroupModuleMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    tagGroupModuleMapDT: any = [];

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _tmservice: TagService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getTagGroupModuleMap();
    }

    public ngOnInit() {

    }

    getTagGroupModuleMap() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all",
            "uid": that.loginUser.uid,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }

        that._tmservice.getTagGroupModuleMap(params).subscribe(data => {
            try {
                that.tagGroupModuleMapDT = data.data;
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

    public addTagGroupModuleMapForm() {
        this._router.navigate(['/erp/master/taggroupmodulemap/add']);
    }

    public editTagGroupModuleMapForm(row) {
        this._router.navigate(['/erp/master/taggroupmodulemap/edit', row.tgmid]);
    }
}
