import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { GalleryService } from '@services/erp';
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
    date: any = "";
    url: string = "";

    mode: string = "";
    isactive: boolean = true;

    global = new Globals();

    uploadCoverDT: any = [];
    uploadcoverconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseCoverLabel: string = "";

    uploadPhotoDT: any = [];
    selectedPhotos: any = [];
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    groupTagDT: any = [];
    gtagdata: any = [];
    gtagid: number = 0;
    gtagnm: string = "";

    uploadVideoDT: any = [];
    vdid: number = 0;
    vdtitle: string = "";
    vdurl: string = "";

    uploadAudioDT: any = [];
    adid: number = 0;
    adtitle: string = "";
    adurl: string = "";

    private subscribeParameters: any;

    constructor(private _glrservice: GalleryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYDropDownList();
        this.getCoverUploadConfig();
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
        var defayDT: any = [];

        commonfun.loader();

        that._glrservice.getAlbumDetails({
            "flag": "ayddl", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.ayDT = data.data;

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = 0;
                        }
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

    // Cover Photos Upload

    getCoverUploadConfig() {
        var that = this;

        that.uploadcoverconfig.server = that.global.serviceurl + "uploads";
        that.uploadcoverconfig.serverpath = that.global.serviceurl;
        that.uploadcoverconfig.uploadurl = that.global.uploadurl;
        that.uploadcoverconfig.filepath = that.global.filepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadcoverconfig.maxFilesize = data.data[0]._filesize;
            that.uploadcoverconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onCoverUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadCoverDT = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadCoverDT.push({ "coverph": imgfile[i].path.replace(that.uploadcoverconfig.filepath, "") })
            }
        }, 1000);
    }

    removeCoverUpload() {
        this.uploadCoverDT.splice(0, 1);
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
                that.uploadPhotoDT.push({
                    "gid": "0", "gtitle": imgfile[i].name, "gurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, ""),
                    "gsize": imgfile[i].size, "tagDT": [], "gtype": imgfile[i].type, "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid, "cuid": that.loginUser.ucode
                })
            }
        }, 1000);
    }

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
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

    // Auto Completed Group Tag

    getGroupTagData(event) {
        let query = event.query;

        this._glrservice.getAlbumDetails({
            "flag": "grouptag",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.groupTagDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Group Tag

    selectGroupTagData(event, row) {
        var that = this;
        var _uploadPhotoDT: any = [];

        row.tagDT.push({ "gtagid": event.tagid, "gtagnm": event.tagnm });
        row.gtagdata = [];
    }

    // Add Photo Tag

    addPhotoTag(row) {
        var that = this;
        var _uploadPhotoDT: any = [];

        row.tagDT.push({ "tagid": row.gtagid, "tagnm": row.gtagnm });
        row.gtagid = 0;
        row.gtagnm = "";
    }

    // Add Album Video

    isValidYoutubeLink(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    }

    addVideo() {
        var that = this;

        if (that.vdurl == "") {
            that._msg.Show(messageType.error, "Error", "Enter Video Url");
            that.vdurl = "";
            $(".vdurl").focus();
        }
        // else if (that.isValidYoutubeLink) {
        //     that._msg.Show(messageType.error, "Error", "Only Valid Youtube Video URL");
        //     that.vdurl = "";
        //     $(".vdurl").focus();
        // }
        else {
            that.uploadVideoDT.push({
                "gid": that.vdid,
                "gtitle": "Video",
                "gdesc": "Video",
                "gurl": that.vdurl,
                "gsize": 0,
                "gtag": "{}",
                "gtype": "youtube",
                "remark3": "[]",
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode
            })

            that.vdid = 0;
            that.vdurl = "";
        }
    }

    // Add Album Audio

    addAudio() {
        var that = this;

        if (that.adurl == "") {
            that._msg.Show(messageType.error, "Error", "Enter Audio Url");
            that.adurl = "";
            $(".adurl").focus();
        }
        // else if (!that.isValidYoutubeLink) {
        //     that._msg.Show(messageType.error, "Error", "Only Valid Youtube Video URL");
        //     that.adurl = "";
        //     $(".vdurl").focus();
        // }
        else {
            that.uploadAudioDT.push({
                "gid": that.adid,
                "gtitle": "Audio",
                "gdesc": "Audio",
                "gurl": that.adurl,
                "gsize": 0,
                "gtag": "{}",
                "gtype": "youtube",
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode
            })

            that.adid = 0;
            that.adurl = "";
        }
    }

    // Active / Deactive Data

    active_deactiveAlbumInfo() {
        var that = this;

        var act_deactalbum = {
            "albumid": that.albumid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._glrservice.saveAlbumInfo(act_deactalbum).subscribe(data => {
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
        that.date = "";
        that.url = "";

        that.uploadCoverDT = [];
        that.chooseCoverLabel = "Upload Cover Photo";

        that.uploadPhotoDT = [];
        that.uploadVideoDT = [];
        that.uploadAudioDT = [];
    }

    // Save Data

    saveAlbumInfo() {
        var that = this;

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
        else if (that.date == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date");
            $(".date").focus();
        }
        else if (that.uploadPhotoDT == []) {
            that._msg.Show(messageType.error, "Error", "Upload Atleast 1 Photo");
        }
        else {
            commonfun.loader();

            for (var i = 0; i < that.uploadPhotoDT.length; i++) {
                var _tagids: string[] = [];
                _tagids = Object.keys(that.uploadPhotoDT[i].tagDT).map(function (k) {
                    return (that.uploadPhotoDT[i].tagDT[k].gtagid == null ? 0 : that.uploadPhotoDT[i].tagDT[k].gtagid)
                });

                that.uploadPhotoDT[i].gtagid = _tagids;
            }

            var savealbum = {
                "albumid": that.albumid,
                "ayid": that.ayid,
                "date": that.date,
                "title": that.title,
                "desc": that.desc,
                "coverph": that.uploadCoverDT.length > 0 ? that.uploadCoverDT[0].coverph : "",
                "uploadphoto": that.uploadPhotoDT,
                "uploadvideo": that.uploadVideoDT,
                "uploadaudio": that.uploadAudioDT,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "cuid": that.loginUser.ucode,
                "mode": ""
            }

            that._glrservice.saveAlbumInfo(savealbum).subscribe(data => {
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

    // Get Album Data

    getAlbumDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.albumid = params['id'];

                that._glrservice.getAlbumDetails({
                    "flag": "edit",
                    "albumid": that.albumid,
                    "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var _albumdata = data.data[0]._albumdata;
                        var _photodata = data.data[0]._photodata;
                        var _videodata = data.data[0]._videodata;
                        var _audiodata = data.data[0]._audiodata;

                        that.ayid = _albumdata[0].ayid;
                        that.date = _albumdata[0].date;
                        that.title = _albumdata[0].title;
                        that.desc = _albumdata[0].desc;
                        that.isactive = _albumdata[0].isactive;
                        that.mode = _albumdata[0].mode;

                        if (_albumdata[0].coverph !== "") {
                            that.uploadCoverDT.push({ "coverph": _albumdata[0].coverph });
                            that.chooseCoverLabel = "Change Cover Photo";
                        }
                        else {
                            that.chooseCoverLabel = "Upload Cover Photo";
                        }

                        if (_photodata !== null) {
                            that.uploadPhotoDT = _photodata;
                            console.log(that.uploadPhotoDT);
                        }
                        else {
                            that.uploadPhotoDT = [];
                        }

                        if (_videodata !== null) {
                            that.uploadVideoDT = _videodata;
                        }
                        else {
                            that.uploadVideoDT = [];
                        }

                        if (_audiodata !== null) {
                            that.uploadAudioDT = _audiodata;
                        }
                        else {
                            that.uploadAudioDT = [];
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
        this._router.navigate(['/master/album']);
    }
}
