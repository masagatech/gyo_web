import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AlbumService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addalbum.comp.html',
    providers: [CommonService]
})

export class AddAlbumComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    ayid: number = 0;

    albumid: number = 0;
    title: string = "";
    desc: string = "";
    url: string = "";

    mode: string = "";
    isactive: boolean = true;

    uploadPhotosDT: any = [];
    global = new Globals();
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    choosePhotoLabel: string = "";

    private subscribeParameters: any;

    constructor(private _albumservice: AlbumService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYDropDownList();
        this.getPhotoUploadConfig();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getAlbumDetails();
    }

    // Fill AY Drop Down

    fillAYDropDownList() {
        var that = this;
        commonfun.loader();

        that._albumservice.getAlbumDetails({
            "flag": "ayddl", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data;
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

    // Album Photos Upload

    getPhotoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "allfile" }).subscribe(data => {
            that.uploadphotoconfig.server = that.global.serviceurl + "uploads";
            that.uploadphotoconfig.serverpath = that.global.serviceurl;
            that.uploadphotoconfig.uploadurl = that.global.uploadurl;
            that.uploadphotoconfig.filepath = that.global.filepath;
            that.uploadphotoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadphotoconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onPhotoUpload(event) {
        var that = this;
        var imgfile = [];
        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadPhotosDT.push({
                    "phtitle": imgfile[i].name, "phurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, ""),
                    "phsize": imgfile[i].size, "tagDT": [], "phtype": imgfile[i].type
                })
            }
        }, 1000);
    }

    removePhotoUpload() {
        this.uploadPhotosDT.splice(0, 1);
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

    // Add Photo Tag

    addPhotoTag(row) {
        row.tagDT.push({ "tagname": row.tagname });
        row.tagname = "";
    }

    // Active / Deactive Data

    active_deactiveAlbumInfo() {
        var that = this;

        var act_deactalbum = {
            "albumid": that.albumid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._albumservice.saveAlbumInfo(act_deactalbum).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_albuminfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_albuminfo.msg);
                    that.getAlbumDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_albuminfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Clear Fields

    resetAlbumFields() {
        var that = this;

        that.albumid = 0;
        that.ayid = 0;
        that.title = "";
        that.desc = "";
        that.url = "";

        that.uploadPhotosDT = [];
        that.choosePhotoLabel = "Upload Photo";
    }

    // Save Data

    saveAlbumInfo() {
        var that = this;
        var _uploadphoto: any = [];

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Academic Year");
            $(".ayname").focus();
        }
        else if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Album Title");
            $(".title").focus();
        }
        else if (that.desc == "") {
            that._msg.Show(messageType.error, "Error", "Enter Description");
            $(".desc").focus();
        }
        else if (that.uploadPhotosDT == []) {
            that._msg.Show(messageType.error, "Error", "Upload Atleast 1 Photo");
        }
        else {
            commonfun.loader();
            for (var i = 0; i < that.uploadPhotosDT.length; i++) {
                debugger;
                var _tags: string[] = [];
                _tags = Object.keys(that.uploadPhotosDT[i].tagDT).map(function (k) { return (that.uploadPhotosDT[i].tagDT[k].tagname || "") });
    
                _uploadphoto.push({
                    "phid": "0",
                    "phtitle": that.uploadPhotosDT[i].phtitle,
                    "phurl": that.uploadPhotosDT[i].phurl,
                    "phsize": that.uploadPhotosDT[i].phsize,
                    "tagDT": _tags,
                    "phtype": that.uploadPhotosDT[i].phtype,
                    "phhead": "photo",
                    "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid,
                    "cuid": that.loginUser.ucode
                })
            }

            var savealbum = {
                "albumid": that.albumid,
                "title": that.title,
                "desc": that.desc,
                "ayid": that.ayid,
                "uploadphoto": _uploadphoto,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._albumservice.saveAlbumInfo(savealbum).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_albuminfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetAlbumFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get album Data

    getAlbumDetails() {
        var that = this;

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.albumid = params['id'];

                that._albumservice.getAlbumDetails({
                    "flag": "edit",
                    "id": that.albumid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var _albumdata = data.data[0]._albumdata;
                        var _uploadphoto = data.data[0]._uploadphoto;

                        that.albumid = _albumdata[0].albumid;
                        that.title = _albumdata[0].title;
                        that.desc = _albumdata[0].desc;
                        that.ayid = _albumdata[0].ayid;
                        that.isactive = _albumdata[0].isactive;
                        that.mode = _albumdata[0].mode;

                        if (_uploadphoto !== null) {
                            that.uploadPhotosDT = _uploadphoto;
                        }
                        else {
                            that.uploadPhotosDT = [];
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
            else {
                that.resetAlbumFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/album']);
    }
}
