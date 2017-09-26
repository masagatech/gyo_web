import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AlbumService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewalbum.comp.html',
    providers: [CommonService]
})

export class ViewAlbumComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    albumDT: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _albumservice: AlbumService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAlbumDetails();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();
        }, 100);
    }

    isshalbum(viewtype) {
        var that = this;

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
        }

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getAlbumDetails() {
        var that = this;

        commonfun.loader();

        that._albumservice.getAlbumDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.albumDT = data.data;
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

    public addAlbumForm() {
        this._router.navigate(['/erp/album/add']);
    }

    public editAlbumForm(row) {
        this._router.navigate(['/erp/album/edit', row.albumid]);
    }
}
