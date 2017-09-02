import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';
import { UserService } from '@services/master';

@Component({
    templateUrl: 'adduwm.comp.html',
    providers: [MenuService, CommonService]
})

export class AddUserWorkspaceMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    usersDT: any = [];

    userdata: any = [];
    uid: number = 0;
    uname: string = "";
    utype: string = "";

    workspaceDT: any = [];
    selectedWorkspace: string[] = [];

    global = new Globals();
    uploadconfig = { uploadurl: "" };

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService, private _userservice: UserService,
        private _wsservice: WorkspaceService, private _loginservice: LoginService, public _menuservice: MenuService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getUploadConfig();
        this.getWorkspaceDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".uname input").focus();
        }, 100);
    }

    getUploadConfig() {
        this.uploadconfig.uploadurl = this.global.uploadurl;
    }

    resetUserRights() {
        $("#uname input").focus();

        this.uid = 0;
        this.uname = "";
        this.userdata = [];
    }

    // Auto Completed User

    getAutoUsers(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "users",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._wsdetails.wsautoid,
            "search": query
        }).subscribe(data => {
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectAutoUsers(event, arg) {
        var that = this;

        that.uid = event.uid;
        that.uname = event.uname;
        that.utype = event.utype;

        that.getUserRightsById();
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        commonfun.loader();

        uparams = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
        };

        that._userservice.getUserDetails(uparams).subscribe(data => {
            try {
                that.usersDT = data.data.filter(a => a.utype != "admin");
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

    getWorkspaceDetails() {
        var that = this;
        var myWorkspaceDT = [];

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": 0
        }).subscribe(data => {
            try {
                that.workspaceDT = data.data.filter(a => !a.issysadmin);
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

    getMenuRights(rights) {
        return rights.split(',');
    }

    getUserRights() {
        var wsitem = null;

        var actrights = "";
        var _wsights = {};

        for (var i = 0; i <= this.workspaceDT.length - 1; i++) {
            wsitem = null;
            wsitem = this.workspaceDT[i];

            if (wsitem !== null) {
                $("#ws" + wsitem.wsautoid).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    _wsights = actrights.slice(0, -1);
                }
            }
        }

        return _wsights;
    }

    saveUserWorkspaceMapping() {
        var that = this;
        var _wsrights = null;
        
        _wsrights = that.getUserRights();

        if (_wsrights === {}) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Rights");
        }
        else {
            var saveUR = {
                "uid": that.uid,
                "utype": that.utype,
                "wsrights": "{" + that._wsdetails.wsautoid + "," + _wsrights + "}",
                "cuid": that.loginUser.login
            }

            that._userservice.updateUserInfo(saveUR).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funupdate_userinfo.msg;
                    var msgid = dataResult[0].funupdate_userinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        $("#menus").prop('checked', false);
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
            }, () => {
            });
        }
    }

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearcheckboxes(): void {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    getUserRightsById() {
        var that = this;
        this.clearcheckboxes();

        that._userservice.getUserDetails({ "flag": "wsrights", "uid": that.uid, "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
            try {
                var viewUR = data.data;

                var _wsrights = null;
                var _wsitem = null;

                if (viewUR[0] != null) {
                    _wsrights = null;
                    _wsrights = viewUR[0].wsrights;

                    if (_wsrights != null) {
                        for (var i = 0; i < _wsrights.length; i++) {
                            _wsitem = null;
                            _wsitem = _wsrights[i];

                            if (_wsitem != null) {
                                $("#selectall").prop('checked', true);
                                $("#ws" + _wsitem).find("#" + _wsitem).prop('checked', true);
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
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    ngOnDestroy() {

    }
}