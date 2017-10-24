import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { GalleryService } from '@services/erp';
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

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _glrservice: GalleryService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAlbumDetails();
    }

    public ngOnInit() {
        
    }

    // Get File Size

    formatSizeUnits(bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1) {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1) {
            bytes = bytes + ' byte';
        }
        else {
            bytes = '0 byte';
        }

        return bytes;
    }

    getAlbumDetails() {
        var that = this;

        commonfun.loader();

        that._glrservice.getAlbumDetails({
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

    totalPhotoCount() {
        var that = this;
        var totalph = 0;

        for (var i = 0; i < that.albumDT.length; i++) {
            var field = that.albumDT[i];

            totalph += parseInt(field.countph);
        }

        return totalph;
    }

    totalVideoCount() {
        var that = this;
        var totalvd = 0;

        for (var i = 0; i < that.albumDT.length; i++) {
            var field = that.albumDT[i];

            totalvd += parseInt(field.countvd);
        }

        return totalvd;
    }

    totalAudioCount() {
        var that = this;
        var totalad = 0;

        for (var i = 0; i < that.albumDT.length; i++) {
            var field = that.albumDT[i];

            totalad += parseInt(field.countad);
        }

        return totalad;
    }

    public addAlbumForm() {
        this._router.navigate(['/master/album/add']);
    }

    public editAlbumForm(row) {
        this._router.navigate(['/master/album/edit', row.albumid]);
    }
}
