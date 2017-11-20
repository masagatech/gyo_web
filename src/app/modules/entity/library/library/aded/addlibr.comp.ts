import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addlibr.comp.html',
    providers: [CommonService]
})

export class AddLibraryComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    librid: number = 0;
    librname: string = "";
    librdesc: string = "";
    totalbook: number = 0;

    librHeadDT: any = [];
    librheaddata: any = [];
    librheadid: number = 0;
    librheadname: string = "";

    uploadLibraryDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    private subscribeParameters: any;

    constructor(private _clsservice: LibraryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.getLibraryDetails();
    }

    // Clear Fields

    resetLibraryFields() {
        var that = this;

        that.librid = 0;
        that.librname = "";
        that.librdesc = "";
        that.totalbook = 0;

        that.librheadid = 0;
        that.librheadname = "";
        that.librheaddata = [];
    }

    // Auto Completed Library Head

    getLibraryHeadData(event, type) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "emptype": "librhead",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.librHeadDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Library Head

    selectLibraryHeadData(event) {
        this.librheadid = event.value;
        this.librheadname = event.label;
    }

    // Save Library

    saveLibraryInfo() {
        var that = this;

        if (that.librname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Library Name");
            $(".librname").focus();
        }
        else if (that.totalbook == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Total Book");
            $(".totalbook").focus();
        }
        else if (that.librheadid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Library Head");
            $(".totalbook").focus();
        }
        else {
            commonfun.loader();
            
            var saveLibrary = {
                "librid": that.librid,
                "librname": that.librname,
                "librdesc": that.librdesc,
                "totalbook": that.totalbook,
                "headid": that.librheadid,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._clsservice.saveLibraryInfo(saveLibrary).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_libraryinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetLibraryFields();
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

    // Get Library

    getLibraryDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.librid = params['id'];

                that._clsservice.getLibraryDetails({
                    "flag": "edit", "librid": that.librid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.librid = data.data[0].librid;
                        that.librname = data.data[0].librname;
                        that.librdesc = data.data[0].librdesc;
                        that.totalbook = data.data[0].totalbook;

                        that.librheadid = data.data[0].librheadid;
                        that.librheadname = data.data[0].librheadname;

                        that.librheaddata.value = that.librheadid;
                        that.librheaddata.label = that.librheadname;
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
                that.resetLibraryFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/library']);
    }
}
