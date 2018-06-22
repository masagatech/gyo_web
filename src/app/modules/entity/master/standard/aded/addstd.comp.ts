import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addstd.comp.html'
})

export class AddStandardComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    paramstdid: number = 0;
    stdid: number = 0;
    stdname: string = "";
    stddesc: string = "";
    stdgrpid: number = 0;
    strength: number = 0;
    clstypid: number = 0;

    stdgroupDT: any = [];
    classTypeDT: any = [];
    subjectDT: any = [];

    private subscribeParameters: any;

    constructor(private _clsservice: ClassService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getStandardDetails();
    }

    // Clear Fields

    resetClassFields() {
        var that = this;

        that.stdid = 0;
        that.stdgrpid = 0;
        that.strength = 0;
        that.clstypid = 0;
    }

    // Fill Standard, Division and Subject Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._clsservice.getStandardDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.stdgroupDT = data.data.filter(a => a.group == "standard");
                that.classTypeDT = data.data.filter(a => a.group == "classtype");
                that.subjectDT = data.data.filter(a => a.group == "subject");
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

    // Get Subject Rights

    getSubjectRights() {
        var that = this;
        var subitem = null;

        var subrights = {};
        var actrights = "";

        for (var i = 0; i <= that.subjectDT.length - 1; i++) {
            subitem = null;
            subitem = that.subjectDT[i];

            if (subitem !== null) {
                $("#sub" + subitem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    subrights = actrights.slice(0, -1);
                }
            }
        }

        return subrights;
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

    // Save Class

    saveStandardInfo() {
        var that = this;
        var _subrights = null;

        _subrights = that.getSubjectRights();

        if (that.stdname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Standard");
            $(".stdname").focus();
        }
        else if (that.stdgrpid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Group");
            $(".division").focus();
        }
        else if (that.strength == 0) {
            that._msg.Show(messageType.error, "Error", "Select Strength");
            $(".strength").focus();
        }
        else if (that.clstypid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class Type");
            $(".strength").focus();
        }
        else if (that.subjectDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Subject Entry on this " + that._enttdetails.enttname);
        }
        else if (_subrights == null) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Subject");
        }
        else {
            commonfun.loader();

            var saveClass = {
                "stdid": that.stdid,
                "stdname": that.stdname,
                "strength": that.strength,
                "clstypid": that.clstypid,
                "stddesc": that.stddesc,
                "subid": "{" + _subrights + "}",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._clsservice.saveStandardInfo(saveClass).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_standardinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetClassFields();
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

    // Get Class

    getStandardDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramstdid = params['id'];

                that._clsservice.getStandardDetails({
                    "flag": "edit", "stdid": that.paramstdid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.stdid = data.data[0].stdid;
                            that.stdname = data.data[0].stdname;
                            that.stddesc = data.data[0].stddesc;
                            that.stdgrpid = data.data[0].stdgrpid;
                            that.strength = data.data[0].strength;
                            that.clstypid = data.data[0].clstypid;

                            var _subrights = null;
                            var _subitem = null;

                            _subrights = null;
                            _subrights = data.data[0].subid;

                            if (_subrights != null) {
                                for (var i = 0; i < _subrights.length; i++) {
                                    _subitem = null;
                                    _subitem = _subrights[i];

                                    if (_subitem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#sub" + _subitem).find("#" + _subitem).prop('checked', true);
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
                that.resetClassFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/standard']);
    }
}
