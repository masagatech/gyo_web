import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { GalleryService } from '@services/erp';

@Component({
    templateUrl: 'rptglr.comp.html'
})

export class GalleryReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    albumid: number = 0;

    uploadPhotoDT: any = [];
    uploadVideoDT: any = [];
    uploadAudioDT: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _glrservice: GalleryService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getGalleryDetails();
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

    getGalleryDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.albumid = params['id'];

                that._glrservice.getGalleryDetails({
                    "flag": "all", "albumid": that.albumid, "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.uploadPhotoDT = data.data.filter(a => a.ghead == "photo");
                        that.uploadVideoDT = data.data.filter(a => a.ghead == "video");
                        that.uploadAudioDT = data.data.filter(a => a.ghead == "audio");
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
            else {
                commonfun.loaderhide();
            }
        });
    }

    // View Gallery Video

    getGalleryVideo(row) {
        var that = this;

        $("#galleryModal").modal('show');
        commonfun.loader("#galleryModal");

        that._glrservice.getGalleryDetails({
            "flag": "id", "enttid": that._enttdetails.enttid, "gid": row.gid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    $("#ivideo")[0].src = data.data[0].gurl;
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide("#galleryModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#galleryModal");
        }, () => {

        })
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}