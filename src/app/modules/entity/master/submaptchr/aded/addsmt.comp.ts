import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SubjectMapToTeacherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addsmt.comp.html',
    providers: [CommonService]
})

export class AddSubjectMapToTeacherComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    teacherDT: any = [];
    tchrdata: any = [];
    tchrid: number = 0;
    tchrname: string = "";

    classDT: any = [];
    subjectDT: any = [];

    smtid: number = 0;
    clsid: number = 0;

    private subscribeParameters: any;

    constructor(private _smtservice: SubjectMapToTeacherService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
        this.fillSubjectDropDown();
    }

    public ngOnInit() {
        var that = this;

        that.onEditMode();

        setTimeout(function () {
        }, 200);
    }

    // Clear Fields

    resetClassFields() {
        var that = this;

        that.clsid = 0;
        that.clearcheckboxes();
    }

    // Auto Completed Teacher

    getTeacherData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "classwiseteacher",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": 0,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.teacherDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Teacher

    selectTeacherData(event) {
        this.tchrid = event.value;
        this.tchrname = event.label;
        this.fillClassDropDown();
    }

    // Fill Class Drop Down

    fillClassDropDown() {
        var that = this;
        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "classddl", "tchrid": that.tchrid, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data;
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

    // Fill Subject Drop Down

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "subjectddl", "classid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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

        var actrights = "";
        var subrights = {};

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
                else{
                    subrights = null;
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

    // Save Subject Map To Teacher

    saveSubjectMapToTeacher() {
        var that = this;
        var _subrights = null;

        _subrights = that.getSubjectRights();

        if (that.tchrid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Class Teacher");
            $(".tchrname input").focus();
        }
        else if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".clsname").focus();
        }
        else if (that.subjectDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Subject on this " + $(".clsname option:selected").text().trim() +" Class");
        }
        else if (_subrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select atleast 1 Subject");
        }
        else {
            commonfun.loader();

            var saveClass = {
                "smtid": that.smtid,
                "tchrid": that.tchrid,
                "clsid": that.clsid,
                "subid": "{" + _subrights + "}",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._smtservice.saveSubjectMapToTeacher(saveClass).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_submapteacher;
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

    // Get Subject Map To Teacher

    onEditMode() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.smtid = params['id'];
                that.getSubjectMapToTeacher();
            }
            else {
                that.resetClassFields();
                commonfun.loaderhide();
            }
        });
    }

    onChangeClass() {
        var that = this;

        if (that.smtid == 0) {
            that.getSubjectMapToTeacher();
        }
    }

    getSubjectMapToTeacher() {
        var that = this;
        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "edit", "smtid": that.smtid, "tchrid": that.tchrid, "clsid": that.clsid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.smtid = data.data[0].smtid;
                    that.tchrid = data.data[0].tchrid;
                    that.tchrname = data.data[0].tchrname;
                    that.tchrdata.value = that.tchrid;
                    that.tchrdata.label = that.tchrname;

                    that.fillClassDropDown();
                    that.clsid = data.data[0].clsid;

                    that.fillSubjectDropDown();

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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/subjectmaptoteacher']);
    }
}
