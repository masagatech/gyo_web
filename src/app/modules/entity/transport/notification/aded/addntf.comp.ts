import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/erp';

@Component({
    templateUrl: 'addntf.comp.html'
})

export class AddTransportNotificationComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ntfTypeDT: any = [];

    ntfid: number = 0;
    ntftype: string = "student";
    title: string = "";
    msg: string = "";

    issendsms: boolean = false;
    issendemail: boolean = false;

    smspack: number = 0;
    usedsms: number = 0;
    pendingsms: number = 0;
    smshead: string = "";
    isvaildsendsms: string = "";

    private subscribeParameters: any;

    constructor(private _ntfservice: NotificationService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getWhichNotification();
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

    getWhichNotification() {
        var that = this;

        that._autoservice.getDropDownData({
            "flag": that.ntftype, "viewtype": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ntfTypeDT = data.data;
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
        that.ntftype = "student";
        that.getWhichNotification();
        that.title = "";
        that.msg = "";
        that.issendsms = false;
        that.issendemail = false;

        that.clearCheckboxes();
    }

    // Select All Checkboxes

    selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    // Clear All Checkboxes

    private clearCheckboxes() {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Save Notification

    isValidationNotification(_torights) {
        var that = this;

        if (that.ntftype == "") {
            that._msg.Show(messageType.error, "Error", "Select Which Notification");
            $(".ntftype").focus();
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

        if (_torights == "") {
            that._msg.Show(messageType.error, "Error", "Please Select " + that.ntftype);
            return false;
        }

        return true;
    }

    // Get To Notification Rights

    getToNotificationRights() {
        var that = this;
        var toitem = null;

        var actrights = "";
        var torights = "";

        for (var i = 0; i <= that.ntfTypeDT.length - 1; i++) {
            toitem = null;
            toitem = that.ntfTypeDT[i];

            if (toitem !== null) {
                $("#toids" + toitem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    torights = actrights.slice(0, -1);
                }
                else {
                    torights = "";
                }
            }
        }

        return torights;
    }

    saveNotification() {
        var that = this;
        var _torights = null;

        var _isvalidntf: boolean = true;

        _torights = that.getToNotificationRights();
        console.log(_torights);
        _isvalidntf = that.isValidationNotification(_torights);

        if (_isvalidntf) {
            commonfun.loader();

            var saventf = {
                "ntfid": that.ntfid,
                "frmid": that.loginUser.uid,
                "frmtype": that.loginUser.utype,
                "toids": "{" + _torights + "}",
                "title": that.title,
                "msg": that.msg,
                "mailmsg": that.msg,
                "ntftype": that.ntftype,
                "issendsms": that.issendsms,
                "issendemail": that.issendemail,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            that._ntfservice.saveTransportNotification(saventf).subscribe(data => {
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

                        var _torights = null;
                        var _toitem = null;

                        if (viewntf[0] != null) {
                            _torights = null;
                            _torights = viewntf[0].toids;

                            if (_torights != null) {
                                for (var i = 0; i < _torights.length; i++) {
                                    _toitem = null;
                                    _toitem = _torights[i];

                                    if (_toitem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#toids" + _toitem).find("#" + _toitem).prop('checked', true);
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
        this._router.navigate(['/transport/notification']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
