import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addexam.comp.html',
    providers: [CommonService]
})

export class AddExamComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    semesterDT: any = [];
    classDT: any = [];
    subjectDT: any = [];
    chapterDT: any = [];

    examid: number = 0;
    ayid: number = 0;
    smstrid: number = 0;
    clsid: number = 0;
    subid: number = 0;
    passmarks: number = 0;
    outofmarks: number = 0;
    chptrid: number = 0;
    examdate: any = "";
    frmtm: any = "";
    totm: any = "";

    private subscribeParameters: any;

    constructor(private _examservice: ExamService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.editExamDetails();
    }

    // Fill Academic Year, Semester And Class Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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

                that.semesterDT = data.data.filter(a => a.group == "semester");
                that.classDT = data.data.filter(a => a.group == "class");
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

        that._examservice.getExamDetails({
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

    // Fill Chapter List

    fillChapterList() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "chapterddl", "classid": that.clsid, "subid": that.subid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.chapterDT = data.data;
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

    // Clear Exam Fields

    resetExamFields() {
        var that = this;

        that.subid = 0;
        that.passmarks = 0;
        that.outofmarks = 0;
        that.examdate = "";
        that.frmtm = "";
        that.totm = "";
        that.chptrid = 0;
        that.chapterDT = [];
        that.clearcheckboxes();
    }

    // Get Subject Shapter Rights

    getSubjectChapterRights() {
        var that = this;
        var chapteritem = null;

        var actrights = "";
        var chapterrights = {};

        for (var i = 0; i <= that.chapterDT.length - 1; i++) {
            chapteritem = null;
            chapteritem = that.chapterDT[i];

            if (chapteritem !== null) {
                $("#chapter" + chapteritem.chptrid).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    chapterrights = actrights.slice(0, -1);
                }
                else {
                    chapterrights = null;
                }
            }
        }

        return chapterrights;
    }

    // Save Exam

    saveExamInfo() {
        var that = this;
        var _chapterrights = null;

        _chapterrights = that.getSubjectChapterRights();

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
        }
        else if (that.smstrid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Semester");
            $(".smstrname").focus();
        }
        else if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subname").focus();
        }
        else if (that.passmarks == 0) {
            that._msg.Show(messageType.error, "Error", "Select Passing Masrks");
            $(".passmarks").focus();
        }
        else if (that.outofmarks == 0) {
            that._msg.Show(messageType.error, "Error", "Select Out Of Marks");
            $(".outofmarks").focus();
        }
        else if (that.examdate == "") {
            that._msg.Show(messageType.error, "Error", "Enter Exam Date");
            $(".examdate").focus();
        }
        else if (that.frmtm == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Time");
            $(".frmtm").focus();
        }
        else if (that.totm == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Time");
            $(".totm").focus();
        }
        else if (that.chapterDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Chapter Entry on this " + $(".subname option:selected").text().trim());
            $(".totm").focus();
        }
        else if (_chapterrights == null) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Chapter");
        }
        else {
            commonfun.loader();

            var saveexam = {
                "examid": that.examid,
                "ayid": that.ayid,
                "smstrid": that.smstrid,
                "clsid": that.clsid,
                "subid": that.subid,
                "passmarks": that.passmarks,
                "outofmarks": that.outofmarks,
                "examdate": that.examdate,
                "frmtm": that.frmtm,
                "totm": that.totm,
                "chptrid": "{" + _chapterrights + "}",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            that._examservice.saveExamInfo(saveexam).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_examinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetExamFields();
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

    // Get Exam

    editExamDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.examid = params['id'];
                that.getExamDetails();
            }
            else {
                that.resetExamFields();
                commonfun.loaderhide();
            }
        });
    }

    getExamDetails() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "edit", "examid": that.examid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var viewexam = data.data;

                if (viewexam.length > 0) {
                    that.examid = viewexam[0].examid;
                    that.ayid = viewexam[0].ayid;
                    that.smstrid = viewexam[0].smstrid;
                    that.clsid = viewexam[0].clsid;
                    that.fillSubjectDropDown();
                    that.subid = viewexam[0].subid;
                    that.fillChapterList();
                    that.passmarks = viewexam[0].passmarks;
                    that.outofmarks = viewexam[0].outofmarks;
                    that.examdate = viewexam[0].examdate;
                    that.frmtm = viewexam[0].frmtm;
                    that.totm = viewexam[0].totm;

                    var _chapterrights = null;
                    var _chapteritem = null;

                    if (viewexam[0] != null) {
                        _chapterrights = null;
                        _chapterrights = viewexam[0].chptrid;

                        if (_chapterrights != null) {
                            for (var i = 0; i < _chapterrights.length; i++) {
                                _chapteritem = null;
                                _chapteritem = _chapterrights[i];

                                if (_chapteritem != null) {
                                    $("#selectall").prop('checked', true);
                                    $("#chapter" + _chapteritem).find("#" + _chapteritem).prop('checked', true);
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
                else {
                    that.examid = 0;
                    that.clsid = 0;
                    that.subid = 0;
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
        this._router.navigate(['/transaction/exam']);
    }
}
