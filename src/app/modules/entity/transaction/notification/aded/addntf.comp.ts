import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addntf.comp.html',
    providers: [CommonService]
})

export class AddNotificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    groupDT: any = [];
    standardDT: any = [];
    teacherDT: any = [];

    ntfid: number = 0;
    grpid: number = 0;
    title: string = "";
    msg: string = "";

    issendsms: boolean = false;
    issendemail: boolean = false;

    smspack: number = 0;
    usedsms: number = 0;
    pendingsms: number = 0;
    smshead: string = "";
    isvaildsendsms: string = "";

    issendparents: boolean = false;
    issendteacher: boolean = false;

    private subscribeParameters: any;

    constructor(private _ntfservice: NotificationService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.sendSMS_Valid();
    }

    public ngOnInit() {
        this.getNotification();

        setTimeout(function () {
            $(".grpname").focus();
        }, 200);
    }

    sendSMS_Valid() {
        var that = this;

        that._autoservice.getDropDownData({
            "flag": "validsendsms", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.smspack = data.data[0].smspack;
                that.usedsms = data.data[0].usedsms;
                that.pendingsms = data.data[0].pendingsms;
                that.smshead = data.data[0].smshead;
                that.isvaildsendsms = data.data[0].isvaildsendsms;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Fill Group Drop Down and Checkbox List For Standard

    fillDropDownList() {
        var that = this;

        that._ntfservice.getNotification({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ntftype": "standard", "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.groupDT = data.data.filter(a => a.group == "ntfgrp");
                that.standardDT = data.data.filter(a => a.group == "standard");

                that.teacherDT = data.data.filter(a => a.group == "teacher");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // Clear Fields

    resetNotificationFields() {
        var that = this;

        that.ntfid = 0;
        that.grpid = 0;
        that.title = "";
        that.msg = "";
        that.issendsms = false;
        that.issendemail = false;
        that.issendparents = false;
        that.issendteacher = false;

        that.clearTeacherCheckboxes();
        that.clearStandardCheckboxes();
    }

    // Get Teacher Rights

    getTeacherRights() {
        var that = this;
        var tchritem = null;

        var actrights = "";
        var tchrrights = "";

        if (that.issendteacher) {
            if ($("#selectallteacher").is(':checked')) {
                tchrrights = "0";
            }
            else {
                for (var i = 0; i <= that.teacherDT.length - 1; i++) {
                    tchritem = null;
                    tchritem = that.teacherDT[i];

                    if (tchritem !== null) {
                        $("#tchr" + tchritem.id).find("input[type=checkbox]").each(function () {
                            actrights += (this.checked ? $(this).val() + "," : "");
                        });

                        if (actrights != "") {
                            tchrrights = actrights.slice(0, -1);
                        }
                        else {
                            tchrrights = "";
                        }
                    }
                }
            }
        }
        else {
            tchrrights = "";
        }

        return tchrrights;
    }

    // Get Standard Rights

    getStandardRights() {
        var that = this;
        var stditem = null;

        var actrights = "";
        var stdrights = "";

        for (var i = 0; i <= that.standardDT.length - 1; i++) {
            stditem = null;
            stditem = that.standardDT[i];

            if (stditem !== null) {
                $("#std" + stditem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    stdrights = actrights.slice(0, -1);
                }
                else {
                    stdrights = "";
                }
            }
        }

        return stdrights;
    }

    // Send Type Checkboxes

    private selectTeacherSendTypeCheckboxes() {
        if (this.issendteacher) {
            $("#divselectteacher").prop('class', "show");
            $("#selectallteacher").prop('checked', true);
            $(".allteachercheckboxes input[type=checkbox]").prop('checked', false);
            $("#divteacher").prop('class', "show");
        }
        else {
            $("#divselectteacher").prop('class', "hide");
            $("#selectallteacher").prop('checked', false);
            $(".allteachercheckboxes input[type=checkbox]").prop('checked', false);
            $("#divteacher").prop('class', "hide");
        }
    }

    // Teacher Checkboxes

    private selectAndDeselectAllTeacherCheckboxes() {
        if ($("#selectallteacher").is(':checked')) {
            $(".allteachercheckboxes input[type=checkbox]").prop('checked', true);
            $("#divteacher").prop('class', "hide");
        }
        else {
            $(".allteachercheckboxes input[type=checkbox]").prop('checked', false);
            $("#divteacher").prop('class', "show");
        }
    }

    private clearTeacherCheckboxes() {
        $(".allteachercheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Standard Checkboxes

    private selectAndDeselectAllStandardCheckboxes() {
        if ($("#selectallstandard").is(':checked')) {
            $(".allstandardcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allstandardcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearStandardCheckboxes() {
        $(".allstandardcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Save Notification

    isValidationNotification(_stdrights, _tchrrights) {
        var that = this;

        if (that.grpid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Group");
            $(".grpname").focus();
            return false;
        }

        if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".ntf-title").focus();
            return false;
        }

        if (that.msg == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".msg").focus();
            return false;
        }

        if ((that.issendparents == false) && (that.issendteacher == false)) {
            that._msg.Show(messageType.error, "Error", "Please Select Send By");
            return false;
        }

        if (that.issendparents == true) {
            if (that.standardDT.length == 0) {
                that._msg.Show(messageType.error, "Error", "No any Class Entry on this " + that._enttdetails.enttname);
                return false;
            }

            if (_stdrights == "") {
                that._msg.Show(messageType.error, "Error", "Please Select Standard");
                return false;
            }
        }

        if (that.issendteacher == true) {
            if (that.standardDT.length == 0) {
                that._msg.Show(messageType.error, "Error", "No any Standard Entry on this " + that._enttdetails.enttname);
                return false;
            }

            if (that.teacherDT.length == 0) {
                that._msg.Show(messageType.error, "Error", "No any Teacher Entry on this " + that._enttdetails.enttname);
                return false;
            }

            if ((_stdrights == "") && (_tchrrights == "")) {
                that._msg.Show(messageType.error, "Error", "Please Select Standard / Teacher");
                return false;
            }
        }

        return true;
    }

    saveNotification() {
        var that = this;

        var _sendtype = "";
        var _stdrights = null;
        var _tchrrights = null;

        var _isvalidntf: boolean = true;

        _sendtype += that.issendparents ? "parents" : "";

        if (that.issendparents) {
            _sendtype += that.issendteacher ? ",teacher" : "";
        }
        else {
            _sendtype += that.issendteacher ? "teacher" : "";
        }

        _stdrights = that.getStandardRights();
        _tchrrights = that.getTeacherRights();

        _isvalidntf = that.isValidationNotification(_stdrights, _tchrrights);

        if (_isvalidntf) {
            commonfun.loader();

            var saventf = {
                "ntfid": that.ntfid,
                "ntftype": "other",
                "title": that.title,
                "msg": that.msg,
                "issendsms": that.issendsms,
                "issendemail": that.issendemail,
                "grpid": that.grpid,
                "frmid": that.loginUser.uid,
                "frmtype": that.loginUser.utype,
                "sendtype": "{" + _sendtype + "}",
                "classid": "{" + _stdrights + "}",
                "studid": "{0}",
                "tchrid": "{" + _tchrrights + "}",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._ntfservice.saveNotification(saventf).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_notification;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetNotificationFields();
                            that.sendSMS_Valid();
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

    // Get Notification

    getNotification() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ntfid = params['id'];

                that._ntfservice.getNotification({ "flag": "edit", "ntfid": that.ntfid, "wsautoid": that._enttdetails.wsautoid }).subscribe(data => {
                    try {
                        var viewntf = data.data;

                        that.ntfid = viewntf[0].ntfid;
                        that.title = viewntf[0].title;
                        that.msg = viewntf[0].msg;
                        that.issendsms = viewntf[0].issendsms;
                        that.issendemail = viewntf[0].issendemail;
                        that.grpid = data.data[0].grpid;

                        var _stdrights = null;
                        var _stditem = null;

                        if (viewntf[0] != null) {
                            _stdrights = null;
                            _stdrights = viewntf[0].classid;

                            if (_stdrights != null) {
                                for (var i = 0; i < _stdrights.length; i++) {
                                    _stditem = null;
                                    _stditem = _stdrights[i];

                                    if (_stditem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#std" + _stditem).find("#" + _stditem).prop('checked', true);
                                    }
                                    else {
                                        $("#selectall").prop('checked', false);
                                    }
                                }
                            }
                            else {
                                $("#selectall").prop('checked', false);
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
            else {
                that.resetNotificationFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/notification']);
    }
}
