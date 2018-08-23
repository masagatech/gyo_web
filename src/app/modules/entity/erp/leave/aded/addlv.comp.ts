import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LeaveService } from '@services/erp';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addlv.comp.html'
})

export class AddLeaveComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    lvid: number = 0;

    psngrtype: any = "";
    psngrtypenm: any = "";

    passengerDT: any = [];
    psngrdata: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    currdate: any = "";
    currtime: any = "";
    frmdt: any = "";
    frmtm: any = "";
    todt: any = "";
    totm: any = "";

    leavetypeDT: string = "";
    lvtype: string = "";
    reason: string = "";

    mode: string = "";
    isactive: boolean = true;

    countlvdays: number = 0;

    ispickup: boolean = false;
    isdrop: boolean = false;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _lvservice: LeaveService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setAppliedLVDate();
        this.fillLeaveTypeDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);

        this.getPassengerLeave();
    }

    // Format Date Time

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    formatTime(date) {
        var d = new Date(date),
            h = '' + d.getHours(),
            m = '' + d.getMinutes();

        if (h.length < 2) h = '0' + h;
        if (m.length < 2) m = '0' + m;

        return h + ':' + m;
    }

    setFromDateAndToDate() {
        var date = new Date();
        var _currdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        this.currdate = this.formatDate(_currdate);
        this.currtime = this.formatDate(date);

        this.frmdt = this.formatDate(_currdate);
        this.todt = this.formatDate(_currdate);

        this.frmtm = this.formatTime(date);
        this.totm = this.formatTime(date);
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": this.psngrtype,
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "emptype": "",
            "classid": "0",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        this.psngrid = event.value;
        this.psngrname = event.label;
    }

    // Leave Type

    fillLeaveTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._lvservice.getLeaveDetails({ "flag": "dropdown" }).subscribe(data => {
            that.leavetypeDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Clear Fields

    resetPassengerLeaveFields() {
        this.lvid = 0;
        this.psngrid = 0;
        this.psngrname = "";
        this.psngrdata = [];
        this.setFromDateAndToDate();
        this.lvtype = "";
        this.reason = "";
    }

    // Validation For Save

    setAppliedLVDate() {
        var that = this;

        that._lvservice.getLeaveDetails({
            "flag": "lvbeforelimit",
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            if (data.data.length > 0) {
                that.countlvdays = parseInt(data.data[0].val);
            }
            else {
                that.countlvdays = 1;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    isValidationForSave() {
        var that = this;

        var date = new Date();
        var today = that.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        var currtime = this.formatTime(date);
        var lvappldate = that.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + that.countlvdays));

        if (that.psngrid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Passenger Name");
            $(".psngrname input").focus();
            return false;
        }
        else if (that.lvtype == "") {
            that._msg.Show(messageType.error, "Error", "Enter Leave Type");
            $(".lvtype").focus();
            return false;
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
            return false;
        }
        else if (today > that.frmdt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be From Date Greater Than Current Date");
            $(".frmdt").focus();
            return false;
        }
        else if (lvappldate > that.frmdt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be Leave Date After " + that.countlvdays + " Days");
            $(".frmdt").focus();
            return false;
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
            return false;
        }
        else if (today > that.todt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be To Date Greater Than Current Date");
            $(".todt").focus();
            return false;
        }
        else if (that.frmdt > that.todt) {
            that._msg.Show(messageType.error, "Error", "Sholul Be To Date Greater Than From Date");
            $(".todt").focus();
            return false;
        }
        else if (currtime > that.frmtm) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be From Time Greater Than Current Time");
            $(".frmtm").focus();
            return false;
        }
        else if (that.reason == "") {
            that._msg.Show(messageType.error, "Error", "Enter Reason");
            $(".reason").focus();
            return false;
        }

        return true;
    }

    // Save Data

    savePassengerLeave() {
        var that = this;
        var isvalid = that.isValidationForSave();

        if (isvalid) {
            commonfun.loader();

            var savelvpsngr = {
                "lvid": that.lvid,
                "psngrid": that.psngrid,
                "frmdt": that.frmdt,
                "frmtm": that.frmtm,
                "todt": that.todt,
                "totm": that.totm,
                "lvtype": that.lvtype,
                "lvfor": that.psngrtype,
                "reason": that.reason,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            that._lvservice.saveLeaveInfo(savelvpsngr).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_leaveinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetPassengerLeaveFields();
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

    // Get Leave Passenger Data

    getPassengerLeave() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];
            }
            else {
                that.psngrtype = "passenger";
            }

            if (params['id'] !== undefined) {
                that.lvid = params['id'];

                that._lvservice.getLeaveDetails({
                    "flag": "edit",
                    "id": that.lvid,
                    "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.lvid = data.data[0].lvid;
                        that.psngrid = data.data[0].psngrid;
                        that.psngrname = data.data[0].psngrname;
                        that.psngrdata.value = that.psngrid;
                        that.psngrdata.label = that.psngrname;
                        that.lvtype = data.data[0].lvtype;
                        that.reason = data.data[0].reason;
                        that.frmdt = data.data[0].frmdt;
                        that.todt = data.data[0].todt;
                        that.frmtm = data.data[0].frmtm;
                        that.ispickup = data.data[0].ispickup;
                        that.isdrop = data.data[0].isdrop;
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
                that.resetPassengerLeaveFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        if (this.psngrtype == "passenger") {
            this._router.navigate(['/master/' + this.psngrtype + '/leave']);
        }
        else {
            this._router.navigate(['/erp/' + this.psngrtype + '/leave']);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}