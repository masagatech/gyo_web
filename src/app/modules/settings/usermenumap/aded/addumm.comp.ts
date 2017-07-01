import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';

@Component({
    templateUrl: 'addumm.comp.html',
    providers: [MenuService, CommonService]
})

export class AddUserMenuMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    usersDT: any = [];
    menuname: string = "";

    uid: number = 0;
    uname: string = "";
    utype: string = "";
    ufullname: string = "";

    refuid: number = 0;
    refuname: string = "";
    refutype: string = "";

    menudetails: any = [];
    selectedMenus: string[] = [];

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService, private _userservice: UserService,
        private _loginservice: LoginService, public _menuservice: MenuService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.getMenuDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".uname input").focus();
        }, 100);
    }

    resetUserRights() {
        $("#uname").focus();
        this.uid = 0;
        this.uname = "";
        this.refuid = 0;
        this.refuname = "";
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

        that.refuid = event.uid;
        that.refuname = event.uname;
        that.refutype = event.utype;

        that.getUserRightsById(that.refuid, that.refutype);
    }

    // Selected Reference User

    selectAutoRefUsers(event, arg) {
        var that = this;

        that.refuid = event.uid;
        that.refuname = event.uname;
        that.refutype = event.utype;
    }

    getMenuDetails() {
        var that = this;

        this._menuservice.getMenuDetails({ "flag": "all" }).subscribe(data => {
            this.menudetails = data.data;
            $("#menus").prop('checked', false);
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        });
    }

    getMenuRights(rights) {
        return rights.split(',');
    }

    getUserRights() {
        var _giverights = [];
        var mitem = null;

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
        else if (that.refuid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Reference User");
            $(".refuname input").focus();
        }
        else {
            var _giverights = that.getUserRights();

            if (_giverights.length === 0) {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Rights");
            }
            else {
                var saveUR = {
                    "uid": that.refuid,
                    "utype": that.refutype,
                    "giverights": _giverights,
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

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private selectAndDeselectMenuWiseCheckboxes(row) {
        if ($("#" + row.mid).is(':checked')) {
            $("#M" + row.mid + " input[type=checkbox]").prop('checked', true);
        }
        else {
            $("#M" + row.mid + " input[type=checkbox]").prop('checked', false);
        }
    }

    private clearcheckboxes(): void {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    getUserRightsById(_uid, _utype) {
        var that = this;
        this.clearcheckboxes();

        that._userservice.getUserRights({ "flag": "details", "uid": _uid, "utype": _utype }).subscribe(data => {
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