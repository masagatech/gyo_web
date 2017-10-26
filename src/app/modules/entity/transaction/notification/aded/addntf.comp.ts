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

    ntfid: number = 0;
    grpid: number = 0;
    title: string = "";
    msg: string = "";

    private subscribeParameters: any;

    constructor(private _ntfservice: NotificationService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getNotification();

        setTimeout(function () {
            $(".grpname").focus();
        }, 200);
    }

    // Clear Fields

    resetNotificationFields() {
        var that = this;

        that.ntfid = 0;
        that.grpid = 0;
        that.title = "";
        that.msg = "";
        that.clearcheckboxes();
    }

    // Get Standard Rights

    getStandardRights() {
        var that = this;
        var stditem = null;

        var actrights = "";
        var stdrights = null;

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
                    stdrights = null;
                }
            }
        }

        return stdrights;
    }

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearcheckboxes() {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Save Notification

    saveNotification() {
        var that = this;
        var _stdrights = null;
        var _parent = "";
        var _teacher = "";

        _stdrights = that.getStandardRights();

        if (that.grpid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Group");
            $(".grpname").focus();
        }
        else if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".ntf-title").focus();
        }
        else if (that.msg == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".msg").focus();
        }
        else if (that.standardDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Class Entry on this " + that._enttdetails.enttname);
        }
        else if (_stdrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select Class");
        }
        else {
            commonfun.loader();

            $("#prnt").find("input[type=checkbox]").each(function () {
                _parent += (this.checked ? $(this).val() : "");
            });

            $("#tchr").find("input[type=checkbox]").each(function () {
                _teacher += (this.checked ? $(this).val() : "");
            });

            var saventf = {
                "ntfid": that.ntfid,
                "ntftype": "standard",
                "sendtype": "{'" + _parent + "', '" + _teacher + "'}",
                "frmid": that.loginUser.loginid,
                "toid": "{" + _stdrights + "}",
                "title": that.title,
                "msg": that.msg,
                "grpid": that.grpid,
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
                        that.grpid = data.data[0].grpid;

                        var _stdrights = null;
                        var _stditem = null;

                        if (viewntf[0] != null) {
                            _stdrights = null;
                            _stdrights = viewntf[0].toid;

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

    // Fill Group Drop Down and Checkbox List For Standard

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getNotification({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ntftype": "standard", "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.groupDT = data.data.filter(a => a.group == "ntfgrp");
                that.standardDT = data.data.filter(a => a.group == "standard");
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/notification']);
    }
}
