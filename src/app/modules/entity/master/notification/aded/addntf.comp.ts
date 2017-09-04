import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addntf.comp.html',
    providers: [CommonService]
})

export class AddNotificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    ntfid: number = 0;

    toUsersDT: any = [];
    toudata: any = [];
    touid: number = 0;
    touname: string = "";
    toUserList: any = [];

    title: string = "";
    msg: string = "";

    private subscribeParameters: any;

    constructor(private _ntfservice: NotificationService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.getNotification();

        setTimeout(function() {
            $(".uname input").focus();
        }, 200);
    }

    // Auto Completed User

    getUserData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "usrdrv",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._wsdetails.wsautoid,
            "search": query
        }).subscribe(data => {
            that.toUsersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event, arg) {
        var that = this;

        that.touid = event.uid;
        that.touname = event.uname;
        that.addUserList();
    }

    // Check Duplicate User

    isDuplicateUser() {
        var that = this;

        for (var i = 0; i < that.toUserList.length; i++) {
            var field = that.toUserList[i];

            if (field.uid == that.touid) {
                that._msg.Show(messageType.error, "Error", "Duplicate User not Allowed");
                return true;
            }
        }

        return false;
    }

    addUserList() {
        var that = this;
        var duplicateUser = that.isDuplicateUser();

        if (!duplicateUser) {
            that.toUserList.push({ "uid": that.touid, "uname": that.touname })
        }

        that.touid = 0;
        that.touname = "";
        that.toudata = [];
        $(".uname input").focus();
    }

    deleteUser(row) {
        this.toUserList.splice(this.toUserList.indexOf(row), 1);
    }

    // Clear Fields

    resetNotificationFields() {
        var that = this;

        that.touid = 0;
        that.touname = "";
        that.toudata = [];
        that.toUserList = [];
        that.title = "";
        that.msg = "";
    }

    // Save Data

    saveNotification() {
        var that = this;
        var _touserlist = {};

        if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".title").focus();
        }
        else if (that.msg == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".msg").focus();
        }
        else {
            _touserlist = Object.keys(that.toUserList).map(function (k) { return that.toUserList[k].uid });

            if (_touserlist == "{}") {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 User");
                $(".uname input").focus();
            }
            else {
                commonfun.loader();

                var saventf = {
                    "ntfid": that.ntfid,
                    "frmid": that.loginUser.loginid,
                    "toid": _touserlist,
                    "title": that.title,
                    "msg": that.msg,
                    "cuid": that.loginUser.ucode,
                    "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid,
                    "ntftype": "other"
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
    }

    // Get Allocate Task

    getNotification() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ntfid = params['id'];

                that._ntfservice.getNotification({
                    "flag": "edit",
                    "ntfid": that.ntfid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.ntfid = data.data[0].ntfid;
                        that.touid = data.data[0].uid;
                        that.touname = data.data[0].uname;

                        that.title = data.data[0].title;
                        that.msg = data.data[0].msg;
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
        this._router.navigate(['/master/notification']);
    }
}
