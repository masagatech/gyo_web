import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { BatchService } from '../../../_services/batch/batch-service';
import { Globals } from '../../../_const/globals';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addbatch.comp.html',
    providers: [BatchService, CommonService]
})

export class AddBatchComponent implements OnInit {
    loginUser: LoginUserModel;

    batchid: number = 0;
    batchcode: string = "";
    batchname: string = "";

    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";

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
        private _loginservice: LoginService, private _batchervice: BatchService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    public ngOnInit() {
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
            "utype": this.loginUser.utype,
            "issysadmin": this._wsdetails.issysadmin,
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
        this.entityid = event.value;
        this.entityname = event.label;
        this.getWeekList();
    }

    getWeekList() {
        var that = this;
        commonfun.loader();

        that._batchervice.getBatchDetails({ "flag": "dropdown", "schid": that.entityid }).subscribe(data => {
            try {
                that.weekDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Clear Fields

    resetBatchFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
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
        else if (that.entityname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".entityname input").focus();
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
                "schoolid": that.entityid,
                "fromtime": that.fromtime,
                "totime": that.totime,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid,
                "instruction": that.instruction,
                "weekallow": that.selectedWeek,
                "isactive": that.isactive,
                "mode": ""
            }

            this._batchervice.saveBatchInfo(savebatch).subscribe(data => {
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

                that._batchervice.getBatchDetails({
                    "flag": "edit",
                    "id": that.batchid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.batchid = data.data[0].autoid;
                        that.batchcode = data.data[0].batchcode;
                        that.batchname = data.data[0].batchname;
                        that.entityid = data.data[0].schoolid;
                        that.entityname = data.data[0].schoolname;
                        that.getWeekList();
                        that.fromtime = data.data[0].fromtime;
                        that.totime = data.data[0].totime;
                        that.instruction = data.data[0].instruction;
                        that.selectedWeek = data.data[0].weekallow !== null ? data.data[0].weekallow : [];
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
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/batch']);
    }
}
