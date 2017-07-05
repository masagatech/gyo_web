import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { BatchService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addbatch.comp.html',
    providers: [CommonService]
})

export class AddBatchComponent implements OnInit {
    loginUser: LoginUserModel;

    batchid: number = 0;
    batchcode: string = "";
    batchname: string = "";

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    fromtime: any = "";
    totime: any = "";
    instruction: string = "";

    weekDT: any = [];
    selectedWeek: string[] = [];

    mode: string = "";
    isactive: boolean = true;

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _batchservice: BatchService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getBatchDetails();
    }

    public onUploadError(event) {
    }

    public onUploadSuccess(event) {
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Owners

    selectEntityData(event, type) {
        this.enttid = event.value;
        this.enttname = event.label;
        this.getWeekList();
    }

    getWeekList() {
        var that = this;
        commonfun.loader();

        that._batchservice.getBatchDetails({
            "flag": "dropdown",
            "schid": that.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.weekDT = data.data;
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

    // Active / Deactive Data

    active_deactiveBatchInfo() {
        var that = this;

        var act_deactbatch = {
            "autoid": that.batchid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._batchservice.saveBatchInfo(act_deactbatch).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_batchinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_batchinfo.msg);
                    that.getBatchDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_batchinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            
        });
    }

    // Clear Fields

    resetBatchFields() {
        this.batchid = 0;
        this.batchcode = "";
        this.batchname = "";
        this.fromtime = "";
        this.totime = "";
        this.instruction = "";
    }

    // Save Data

    saveBatchInfo() {
        var that = this;

        if (that.batchcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Batch Code");
            $(".batchcode").focus();
        }
        else if (that.batchname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Batch Name");
            $(".batchname").focus();
        }
        else if (that.enttname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname input").focus();
        }
        else if (that.fromtime == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Time");
            $(".fromtime").focus();
        }
        else if (that.totime == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Time");
            $(".totime").focus();
        }
        else if (that.selectedWeek.length == 0) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Week");
        }
        else {
            commonfun.loader();

            var savebatch = {
                "autoid": that.batchid,
                "batchcode": that.batchcode,
                "batchname": that.batchname,
                "schoolid": that.enttid,
                "fromtime": that.fromtime,
                "totime": that.totime,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "instruction": that.instruction,
                "weekallow": that.selectedWeek,
                "isactive": that.isactive,
                "mode": ""
            }

            this._batchservice.saveBatchInfo(savebatch).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_batchinfo.msg;
                    var msgid = dataResult[0].funsave_batchinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetBatchFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        var msg = dataResult[0].funsave_batchinfo.msg;
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                console.log(err);
                commonfun.loaderhide();
            }, () => {
            });
        }
    }

    // Get Batch Data

    getBatchDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.batchid = params['id'];

                that._batchservice.getBatchDetails({
                    "flag": "edit",
                    "id": that.batchid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.batchid = data.data[0].autoid;
                        that.batchcode = data.data[0].batchcode;
                        that.batchname = data.data[0].batchname;
                        that.enttid = data.data[0].schoolid;
                        that.enttname = data.data[0].schoolname;
                        that.getWeekList();
                        that.fromtime = data.data[0].fromtime;
                        that.totime = data.data[0].totime;
                        that.instruction = data.data[0].instruction;
                        that.selectedWeek = data.data[0].weekallow !== null ? data.data[0].weekallow : [];
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;
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
                if (Cookie.get('_enttnm_') != null) {
                    this.enttid = parseInt(Cookie.get('_enttid_'));
                    this.enttname = Cookie.get('_enttnm_');

                    this.getWeekList();
                }

                that.resetBatchFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/batch']);
    }
}
