import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';

@Component({
    templateUrl: 'adduwm.comp.html'
})

export class AddUserWorkspaceMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    usersDT: any = [];

    userdata: any = [];
    uid: number = 0;
    uname: string = "";
    utype: string = "";

    workspaceDT: any = [];
    selectedWorkspace: string[] = [];

    global = new Globals();
    uploadconfig = { uploadurl: "" };

    constructor(private _msg: MessageService, private _loginservice: LoginService, private _autoservice: CommonService,
        private _userservice: UserService) {
        this.loginUser = this._loginservice.getUser();

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

    getUserData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "formapwsuser",
            "search": query
        }).subscribe(data => {
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event, arg) {
        var that = this;

        that.uid = event.uid;
        that.uname = event.uname;
        that.utype = event.utype;

        that.getUserRightsById();
    }

    // Get Workspace Details

    getWorkspaceDetails() {
        var that = this;

        commonfun.loader();

        that._userservice.getUserRights({
            "flag": "wsrights", "uid": that.loginUser.uid, "utype": that.loginUser.utype
        }).subscribe(data => {
            try {
                that.workspaceDT = data.data;
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

    // Save Workspace Rights

    saveUserWorkspaceMapping() {
        var that = this;

        var wsdata = null;
        var enttdata = null;

        var actwsrights = "";
        var actenttrights = "";

        var wsrights = null;
        var enttrights = null;

        for (var i = 0; i < that.workspaceDT.length; i++) {
            wsdata = null;
            wsdata = that.workspaceDT[i];

            if (wsdata !== null) {
                for (var j = 0; j < wsdata.schooldt.length; j++) {
                    enttdata = null;
                    enttdata = wsdata.schooldt[j];
        
                    if (enttdata !== null) {
                        $("#entt" + enttdata.schid).find("input[type=checkbox]").each(function () {
                            actwsrights += (this.checked ? wsdata.wsautoid + "," : "");
                            actenttrights += (this.checked ? $(this).val() + "," : "");
                        });

                        if (actwsrights != "") {
                            wsrights = actwsrights.slice(0, -1);
                        }

                        if (actenttrights != "") {
                            enttrights = actenttrights.slice(0, -1);
                        }
                    }
                }
            }
        }

        if (that.uid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter User");
            $(".uname input").focus();
        }
        else if (that.workspaceDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Workspace");
        }
        else if (enttrights == null) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Workspace");
        }
        else {
            var saveUR = {
                "uid": that.uid,
                "utype": that.utype,
                "wsrights": "{" + wsrights + "}",
                "enttrights": "{" + enttrights + "}",
                "forrights": "wsmap",
                "cuid": that.loginUser.login
            }

            that._userservice.saveUserRights(saveUR).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_userrights;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

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

    selectAndDeselectAllCheckboxes() {
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

        that._userservice.getUserRights({
            "flag": "wsmap", "uid": that.uid, "utype": that.utype
        }).subscribe(data => {
            try {
                var viewUR = data.data;

                var _enttrights = null;
                var _enttitem = null;

                if (viewUR[0] != null) {
                    _enttrights = null;
                    _enttrights = viewUR[0].enttrights;

                    if (_enttrights != null) {
                        for (var i = 0; i < _enttrights.length; i++) {
                            _enttitem = null;
                            _enttitem = _enttrights[i];

                            if (_enttitem != null) {
                                $("#selectall").prop('checked', true);
                                $("#entt" + _enttitem).find("#" + _enttitem).prop('checked', true);
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