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
    _enttdetails: any = [];

    batchid: number = 0;
    batchcode: string = "";
    batchname: string = "";
    instruction: string = "";

    weekDT: any = [];
    selectedWeek: string[] = [];

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _batchservice: BatchService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.getBatchDetails();
    }

    getWorkingDay() {
        let that = this;

        this._batchservice.getBatchDetails({
            "flag": "wkday",
            "batchid": that.batchid,
            "schid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            that.weekDT = data.data;

            for (var i = 0; i < data.data.length; i++) {
                var wkflds = data.data[i];
                that.selectWeekRow(wkflds);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        });
    }

    selectWeekRow(wkrow) {
        if (!wkrow.isopen) {
            $(".pft" + wkrow.name).prop("disabled", "disabled");
            $(".ptt" + wkrow.name).prop("disabled", "disabled");
            $(".dft" + wkrow.name).prop("disabled", "disabled");
            $(".dtt" + wkrow.name).prop("disabled", "disabled");
        }
        else {
            $(".pft" + wkrow.name).removeAttr("disabled");
            $(".ptt" + wkrow.name).removeAttr("disabled");
            $(".dft" + wkrow.name).removeAttr("disabled");
            $(".dtt" + wkrow.name).removeAttr("disabled");
        }
    }

    copyAcrossRow() {
        var selectedWeekDT = [];

        selectedWeekDT = this.weekDT.filter(a => a.isopen == true);

        if (selectedWeekDT.length == 0) {
            this._msg.Show(messageType.error, "Error", "Select Atleast 1 Row");
        }
        else {
            if (selectedWeekDT[0].pickfrmtm == "" || selectedWeekDT[0].picktotm == "") {
                this._msg.Show(messageType.error, "Error", "Fill Atleast 1 Row");
            }
            else {
                for (var i = 0; i < this.weekDT.length; i++) {
                    var wkflds = this.weekDT[i];

                    wkflds.isopen = selectedWeekDT[0].isopen;
                    wkflds.pickfrmtm = selectedWeekDT[0].pickfrmtm;
                    wkflds.picktotm = selectedWeekDT[0].picktotm;
                    wkflds.dropfrmtm = selectedWeekDT[0].dropfrmtm;
                    wkflds.droptotm = selectedWeekDT[0].droptotm;
                }
            }
        }
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
        this.instruction = "";
        this.getWorkingDay();
    }

    // Save Data

    isValidBatch() {
        let that = this;

        if (that.batchcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Batch Code");
            $(".batchcode").focus();
            return false;
        }
        else if (that.batchname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Batch Name");
            $(".batchname").focus();
            return false;
        }

        for (var i = 0; i < that.weekDT.length; i++) {
            var selectedweeklist = that.weekDT.filter(a => a.isopen);
            var _weeklist = that.weekDT[i];

            if (selectedweeklist.length == 0) {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Working Days");
                $("." + _weeklist.name).focus();
                return false;
            }
            else {
                if (_weeklist.isopen) {
                    if (_weeklist.pickfrmtm == null || _weeklist.pickfrmtm == "") {
                        that._msg.Show(messageType.error, "Error", "Enter " + _weeklist.name + " Pickup From Time");
                        $(".pft" + _weeklist.name).focus();
                        return false;
                    }
                    
                    if (_weeklist.picktotm == null || _weeklist.picktotm == "") {
                        that._msg.Show(messageType.error, "Error", "Enter " + _weeklist.name + " Pickup To Time");
                        $(".ptt" + _weeklist.name).focus();
                        return false;
                    }
                    
                    if (_weeklist.dropfrmtm == null || _weeklist.dropfrmtm == "") {
                        that._msg.Show(messageType.error, "Error", "Enter " + _weeklist.name + " Drop From Time");
                        $(".dft" + _weeklist.name).focus();
                        return false;
                    }
                    
                    if (_weeklist.droptotm == null || _weeklist.droptotm == "") {
                        that._msg.Show(messageType.error, "Error", "Enter " + _weeklist.name + " Drop To Time");
                        $(".dtt" + _weeklist.name).focus();
                        return false;
                    }
                    
                    if (_weeklist.pickfrmtm > _weeklist.picktotm) {
                        that._msg.Show(messageType.error, "Error", "Sholuld Be " + _weeklist.name + " Pickup To Time Greater Than Pickup From Time");
                        $(".picktotm" + _weeklist.name).focus();
                        return false;
                    }
                    
                    if (_weeklist.dropfrmtm > _weeklist.droptotm) {
                        that._msg.Show(messageType.error, "Error", "Sholuld Be " + _weeklist.name + " Drop To Time Greater Than Drop From Time");
                        $(".droptotm" + _weeklist.name).focus();
                        return false;
                    }
                }
            }
        }

        return true;
    }

    saveBatchInfo() {
        var that = this;

        var isvalidbtc = that.isValidBatch();

        if (isvalidbtc) {
            commonfun.loader();

            var selectedweeklist = that.weekDT.filter(a => a.isopen);

            var savebatch = {
                "autoid": that.batchid,
                "batchcode": that.batchcode,
                "batchname": that.batchname,
                "weekdtls": selectedweeklist,
                "instruction": that.instruction,
                "cuid": that.loginUser.ucode,
                "schoolid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
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
                that.getWorkingDay();

                that._batchservice.getBatchDetails({
                    "flag": "edit",
                    "id": that.batchid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.batchid = data.data[0].autoid;
                        that.batchcode = data.data[0].batchcode;
                        that.batchname = data.data[0].batchname;
                        that.instruction = data.data[0].instruction;
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
                that.resetBatchFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transport/batch']);
    }
}
