import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NoticeboardService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addnb.comp.html'
})

export class AddNoticeboardComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    nbtypeDT: any = [];
    nbtype: string = "";
    nbtypenm: string = "";

    nbid: number = 0;
    nbtitle: string = "";
    nbdesc: string = "";
    nbdate: any = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _nbservice: NoticeboardService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        this.fillDropDownList();
        this.getNoticeboard();
    }

    // Fill Group Drop Down and Checkbox List For Standard

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            var _group = "";

            if (params['psngrtype'] !== undefined) {
                that.nbtype = params['psngrtype'];

                if (that.nbtype == "school") {
                    _group = "school";
                    that.nbtypenm = 'School';
                }
                else if (that.nbtype == "class") {
                    _group = "class";
                    that.nbtypenm = 'Class';
                }
                else if (that.nbtype == "teacher") {
                    _group = "staff";
                    that.nbtypenm = 'Teacher';
                }
                else {
                    _group = "staff";
                    that.nbtypenm = 'Employee';
                }
            }
            else {
                _group = "staff";
                that.nbtype = "passenger";
                that.nbtypenm = 'Passenger';
            }

            that._nbservice.getNoticeboard({
                "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "stafftype": that.nbtype,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
            }).subscribe(data => {
                try {
                    that.nbtypeDT = data.data.filter(a => a.group == _group);
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
        });
    }

    // Clear Fields

    resetNoticeboardFields() {
        var that = this;

        that.nbid = 0;
        that.nbtitle = "";
        that.nbdesc = "";
        that.nbdate = "";

        that.clearCheckboxes();
    }

    // Get Standard Rights

    getNBTypeRights() {
        var that = this;
        var nbitem = null;

        var actrights = "";
        var nbrights = {};

        for (var i = 0; i <= that.nbtypeDT.length - 1; i++) {
            nbitem = null;
            nbitem = that.nbtypeDT[i];

            if (nbitem !== null) {
                $("#nb" + nbitem.key).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    nbrights = actrights.slice(0, -1);
                }
                else {
                    nbrights = null;
                }
            }
        }

        return nbrights;
    }

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearCheckboxes() {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Save Noticeboard

    isValidationNoticeboard(_nbrights) {
        var that = this;

        if (that.nbtitle == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".nbtitle").focus();
            return false;
        }
        if (that.nbdesc == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".nbdesc").focus();
            return false;
        }
        if (that.nbdate == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date");
            $(".nbdate").focus();
            return false;
        }
        if (that.nbtype !== "school") {
            if (that.nbtypeDT.length == 0) {
                that._msg.Show(messageType.error, "Error", "No any " + that.nbtypenm + " Entry on this " + that._enttdetails.enttname);
                return false;
            }
        }
        if (_nbrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select Class");
            return false;
        }

        return true;
    }

    saveNoticeboard() {
        var that = this;
        var _nbrights = null;
        var _isvalidnb = false;

        _nbrights = that.getNBTypeRights();
        _isvalidnb = that.isValidationNoticeboard(_nbrights);

        if (_isvalidnb) {
            commonfun.loader();

            var _classid = "";
            var _empid = "";

            if (that.nbtype == "school") {
                _classid = "{0}";
                _empid = "{0}";
            }
            else if (that.nbtype == "class") {
                _classid = "{" + _nbrights + "}";
                _empid = "{0}";
            }
            else {
                _classid = "{}";
                _empid = "{" + _nbrights + "}";
            }

            var savenb = {
                "nbid": that.nbid,
                "nbtitle": that.nbtitle,
                "nbdesc": that.nbdesc,
                "nbdate": that.nbdate,
                "nbtype": that.nbtype,
                "frmid": that.loginUser.uid,
                "frmtype": that.loginUser.utype,
                "classid": _classid,
                "empid": _empid,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._nbservice.saveNoticeboard(savenb).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_noticeboard;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetNoticeboardFields();
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

    // Get Noticeboard

    getNoticeboard() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.nbtype = params['psngrtype'];

                if (params['id'] !== undefined) {
                    that.nbid = params['id'];

                    that._nbservice.getNoticeboard({
                        "flag": "edit",
                        "nbid": that.nbid,
                        "nbtype": that.nbtype,
                        "wsautoid": that._enttdetails.wsautoid
                    }).subscribe(data => {
                        try {
                            var viewnb = data.data;

                            that.nbid = viewnb[0].nbid;
                            that.nbtitle = viewnb[0].nbtitle;
                            that.nbdesc = viewnb[0].nbdesc;
                            that.nbdate = viewnb[0].nbdate;

                            var _nbrights = null;
                            var _nbitem = null;

                            if (viewnb[0] != null) {
                                _nbrights = null;
                                _nbrights = viewnb[0].recvid;

                                if (_nbrights != null) {
                                    for (var i = 0; i < _nbrights.length; i++) {
                                        _nbitem = null;
                                        _nbitem = _nbrights[i];

                                        if (_nbitem != null) {
                                            $("#selectall").prop('checked', true);
                                            $("#nb" + _nbitem).find("#" + _nbitem).prop('checked', true);
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
                    that.resetNoticeboardFields();
                    commonfun.loaderhide();
                }
            }
        });
    }

    // Back For View Data

    backViewData() {
        if (this.nbtype == "teacher") {
            this._router.navigate(['/erp/teacher/noticeboard']);
        }
        else if (this.nbtype == "employee") {
            this._router.navigate(['/erp/employee/noticeboard']);
        }
        else {
            this._router.navigate(['/communication/noticeboard/' + this.nbtype]);
        }
    }
}
