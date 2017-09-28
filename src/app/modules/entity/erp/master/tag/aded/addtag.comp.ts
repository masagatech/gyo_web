import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TagService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addtag.comp.html',
    providers: [CommonService]
})

export class AddTagComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    groupDT: any = [];
    grpid: number = 0;

    tagid: number = 0;
    tagnm: string = "";
    remark1: string = "";
    remark2: string = "";
    remark3: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _tagservice: TagService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillGroupDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getTagDetails();
    }

    // Clear Fields

    resetTagFields() {
        this.tagid = 0;
        this.tagnm = "";
        this.grpid = 0;
        this.remark1 = "";
        this.remark2 = "";
        this.remark3 = "";
    }

    // Fill Group DropDown

    fillGroupDropDown() {
        var that = this;
        commonfun.loader();

        that._tagservice.getTagDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.groupDT = data.data;
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

    // Save Data

    saveTagInfo() {
        var that = this;

        if (that.tagnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Tag Name");
            $(".tagnm").focus();
        }
        else if (that.remark1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Remark");
            $(".enttname input").focus();
        }
        else {
            commonfun.loader();

            var saveTag = {
                "tagid": that.tagid,
                "tagnm": that.tagnm,
                "grpid": that.grpid,
                "tagtype": "p",
                "enttid": that._enttdetails.enttid,
                "remark1": that.remark1,
                "remark2": that.remark2,
                "remark3": that.remark3,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._tagservice.saveTagInfo(saveTag).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_taginfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetTagFields();
                        }
                        else {
                            that.backViewData();
                        }

                        commonfun.loaderhide();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                        commonfun.loaderhide();
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    // Get Tag Data

    getTagDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.tagid = params['id'];

                params = {
                    "flag": "edit",
                    "tagid": that.tagid,
                    "wsautoid": that._enttdetails.wsautoid
                }

                that._tagservice.getTagDetails(params).subscribe(data => {
                    try {
                        that.tagid = data.data[0].tagid;
                        that.tagnm = data.data[0].tagnm;
                        that.remark1 = data.data[0].remark1;
                        that.remark2 = data.data[0].remark2;
                        that.remark3 = data.data[0].remark3;
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
                that.resetTagFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/tag']);
    }
}