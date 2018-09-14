import { Component, OnInit, OnDestroy, } from '@angular/core';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';

@Component({
    templateUrl: 'addumm.comp.html'
})

export class AddUserMenuMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    usersDT: any = [];
    menuname: string = "";

    userdata: any = [];
    uid: number = 0;
    uname: string = "";
    utype: string = "";
    isempuser: boolean = false;

    menudetails: any = [];
    selectedMenus: string[] = [];

    constructor(private _autoservice: CommonService, private _userservice: UserService, private _loginservice: LoginService,
        public _menuservice: MenuService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".uname input").focus();
        }, 100);
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
            "flag": "formapuser",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin,
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
        that.isempuser = event.isemp;

        that.getMenuDetails();
    }

    getMenuDetails() {
        var that = this;
        $("#menus").prop('checked', false);

        that._menuservice.getMenuDetails({
            "flag": "all", "entttype": that._enttdetails.entttype, "psngrtype": that._enttdetails.psngrtype, "isemp": that.isempuser
        }).subscribe(data => {
            that.menudetails = data.data;
            that.getUserRightsById();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        });
    }

    getMenuRights(rights) {
        return rights.split(',');
    }

    getUserRights() {
        var mitem = null;
        var _giverights = [];

        for (var i = 0; i <= this.menudetails.length - 1; i++) {
            mitem = null;
            mitem = this.menudetails[i];

            if (mitem !== null) {
                var actrights = "";

                $("#M" + mitem.mid).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    _giverights.push({ "mid": mitem.mid, "mrights": actrights.slice(0, -1) });
                }
            }
        }

        return _giverights;
    }

    saveUserRights() {
        var that = this;

        if (that.uid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter User");
            $(".uname input").focus();
        }
        else {
            var _giverights = that.getUserRights();

            if (_giverights.length === 0) {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Rights");
            }
            else {
                var saveUR = {
                    "uid": that.uid,
                    "utype": that.utype,
                    "giverights": _giverights,
                    "forrights": "menumap",
                    "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid,
                    "cuid": that.loginUser.login
                }

                that._userservice.saveUserRights(saveUR).subscribe(data => {
                    try {
                        var dataResult = data.data;

                        if (dataResult[0].funsave_userrights.msgid != "-1") {
                            that._msg.Show(messageType.success, "Success", dataResult[0].funsave_userrights.msg);
                            $("#menus").prop('checked', false);
                        }
                        else {
                            that._msg.Show(messageType.error, "Error", dataResult[0].funsave_userrights.msg);
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
    }

    selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    selectAndDeselectMenuWiseCheckboxes(row) {
        if ($("#" + row.mid).is(':checked')) {
            $("#M" + row.mid + " input[type=checkbox]").prop('checked', true);
        }
        else {
            $("#M" + row.mid + " input[type=checkbox]").prop('checked', false);
        }
    }

    clearcheckboxes(): void {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    getUserRightsById() {
        var that = this;
        this.clearcheckboxes();

        that._userservice.getUserRights({
            "flag": "menumap", "uid": that.uid, "utype": that.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var viewUR = data.data;

                var _userrights = null;
                var _menuitem = null;
                var _actrights = null;

                if (viewUR[0] != null) {
                    _userrights = null;
                    _userrights = viewUR[0].giverights;

                    if (_userrights != null) {
                        for (var i = 0; i < _userrights.length; i++) {
                            _menuitem = null;
                            _menuitem = _userrights[i];

                            if (_menuitem != null) {
                                _actrights = null;
                                _actrights = _menuitem.mrights.split(',');

                                if (_actrights != null) {
                                    for (var j = 0; j <= _actrights.length - 1; j++) {
                                        $("#M" + _menuitem.mid).find("#" + _menuitem.mid + _actrights[j]).prop('checked', true);
                                    }
                                    $(".allcheckboxes").find("#" + _menuitem.mid).prop('checked', true);
                                    $("#menus").prop('checked', true);
                                }
                                else {
                                    $(".allcheckboxes").find("#" + _menuitem.mid).prop('checked', false);
                                    $("#menus").prop('checked', false);
                                }
                            }
                        }
                    }
                    else {
                        $(".allcheckboxes").find("#" + _menuitem.mid).prop('checked', false);
                        $("#menus").prop('checked', false);
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