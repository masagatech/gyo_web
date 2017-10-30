import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { HolidayService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addhld.comp.html',
    providers: [CommonService]
})

export class AddHolidayComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];

    ayid: number = 0;
    hldid: number = 0;
    frmdt: any = "";
    todt: any = "";

    hldcd: string = "";
    hldnm: string = "";
    hlddesc: string = "";

    hldforDT: any = [];
    standardDT: any = [];

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _hldservice: HolidayService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".frmdt").focus();
        }, 100);

        this.getHolidayDetails();
    }

    // Clear Fields

    resetHolidayFields() {
        this.hldid = 0;
        this.frmdt = "";
        this.todt = "";
        this.hldnm = "";
        this.hlddesc = "";
    }

    // Fill Academic Year Drop Down and Checkbox List For Holiday For And Standard

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._hldservice.getHoliday({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.standardDT = data.data.filter(a => a.group == "standard");

                that.hldforDT.push({ "id": "Student", "val": "Student" });
                that.hldforDT.push({ "id": "Teacher", "val": "Teacher" });
                that.hldforDT.push({ "id": "Employee", "val": "Employee" });
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

    private selectAndDeselectAllHolidayForCheckboxes() {
        if ($("#selectallhldfor").is(':checked')) {
            $(".hldforcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".hldforcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearHolidayForCheckboxes() {
        $(".hldforcheckboxes input[type=checkbox]").prop('checked', false);
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

    // Get Send Type Rights

    getHolidayForRights() {
        var that = this;
        var hldforitem = null;

        var actrights = "";
        var hldforrights = null;

        for (var i = 0; i <= that.hldforDT.length - 1; i++) {
            hldforitem = null;
            hldforitem = that.hldforDT[i];

            if (hldforitem !== null) {
                $("#hldfor" + hldforitem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    hldforrights = actrights.slice(0, -1);
                }
                else {
                    hldforrights = null;
                }
            }
        }

        return hldforrights;
    }

    // Get Standard Rights

    getStandardRights() {
        var that = this;
        var hldforitem = null;

        var actrights = "";
        var stdrights = null;

        for (var i = 0; i <= that.standardDT.length - 1; i++) {
            hldforitem = null;
            hldforitem = that.standardDT[i];

            if (hldforitem !== null) {
                $("#hldfor" + hldforitem.id).find("input[type=checkbox]").each(function () {
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

    // Active / Deactive Data

    active_deactiveHolidayInfo() {
        var that = this;

        var act_deacthld = {
            "hldid": that.hldid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._hldservice.saveHoliday(act_deacthld).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_holiday.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_holiday.msg);
                    that.getHolidayDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_holiday.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {

        });
    }

    // Save Data

    saveHolidayInfo() {
        var that = this;
        var _stdrights = null;
        var _hldforrights = null;

        if ($(".hldforcheckboxes input[type=checkbox]").checked) {
            _hldforrights = "0";
        }
        else {
            _hldforrights = that.getHolidayForRights();
        }

        if ($(".allcheckboxes input[type=checkbox]").checked) {
            _stdrights = "0";
        }
        else {
            _stdrights = that.getStandardRights();
        }

        if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
        }
        else if (that.hldnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Holiday Title");
            $(".hldnm").focus();
        }
        else if (_hldforrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select Holiday For");
        }
        else if (that.standardDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Class Entry on this " + that._enttdetails.enttname);
        }
        else if (_stdrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select Class");
        }
        else {
            commonfun.loader();

            var saveholiday = {
                "hldid": that.hldid,
                "hldcd": that.hldcd,
                "hldnm": that.hldnm,
                "hlddesc": that.hlddesc,
                "hldfor": _hldforrights + "}",
                "classid": "{" + _stdrights + "}",
                "frmdt": that.frmdt,
                "todt": that.todt,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,
                "mode": ""
            }

            that._hldservice.saveHoliday(saveholiday).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_holiday.msg;
                    var msgid = dataResult[0].funsave_holiday.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetHolidayFields();
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

    // Get Holiday Data

    getHolidayDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.hldid = params['id'];

                that._hldservice.getHoliday({
                    "flag": "edit",
                    "id": that.hldid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var viewhld = data.data;

                        that.hldid = viewhld[0].hldid;
                        that.hldcd = viewhld[0].hldcd;
                        that.hldnm = viewhld[0].hldnm;
                        that.hlddesc = viewhld[0].hlddesc;
                        that.frmdt = viewhld[0].frmdt;
                        that.todt = viewhld[0].todt;
                        that.isactive = viewhld[0].isactive;
                        that.mode = viewhld[0].mode;

                        var _sendforrights = null;
                        var _sendforitem = null;

                        if (viewhld[0] != null) {
                            _sendforrights = null;
                            _sendforrights = viewhld[0].hldfor;

                            if (_sendforrights != null) {
                                for (var i = 0; i < _sendforrights.length; i++) {
                                    _sendforitem = null;
                                    _sendforitem = _sendforrights[i];

                                    if (_sendforitem != null) {
                                        $("#selectallhldfor").prop('checked', true);
                                        $("#hldfor" + _sendforitem).find("#" + _sendforitem).prop('checked', true);
                                    }
                                    else {
                                        $("#selectallhldfor").prop('checked', false);
                                    }
                                }
                            }
                            else {
                                $("#selectallhldfor").prop('checked', false);
                            }
                        }

                        var _stdrights = null;
                        var _stditem = null;

                        if (viewhld[0] != null) {
                            _stdrights = null;
                            _stdrights = viewhld[0].classid;

                            if (_stdrights != null) {
                                for (var i = 0; i < _stdrights.length; i++) {
                                    _stditem = null;
                                    _stditem = _stdrights[i];

                                    if (_stditem != null) {
                                        if (_stdrights == 0) {
                                            $("#selectall").prop('checked', true);
                                            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
                                        }
                                        else {
                                            $("#std" + _stditem).find("#" + _stditem).prop('checked', true);
                                        }
                                    }
                                    else {
                                        $("#selectall").prop('checked', false);
                                        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
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
                that.resetHolidayFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/holiday']);
    }
}