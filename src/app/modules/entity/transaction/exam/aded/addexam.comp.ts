import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addexam.comp.html'
})

export class AddExamComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    semesterDT: any = [];
    classDT: any = [];
    examListDT: any = [];
    selectedExamList: any = [];
    selectedExamRow: any = {};
    chapterDT: any = [];

    examid: number = 0;
    ayid: number = 0;
    smstrid: number = 0;
    clsid: number = 0;
    passmarks: number = 0;
    outofmarks: number = 0;
    chptrid: number = 0;
    examdate: any = "";
    frmtm: any = "";
    totm: any = "";

    private subscribeParameters: any;

    constructor(private _examservice: ExamService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        
    }

    // Fill Academic Year, Exam Type And Class Down

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

    // Fill Exam List

    fillExamList() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "aded", "ayid": that.ayid, "smstrid": that.smstrid, "classid": that.clsid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.examListDT = data.data;
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

    // Select Chapter For Exam

    selectChapterForExam(row) {
        this.selectedExamRow = row;
        $("#viewChapterModal").modal('show');
        this.fillChapterList(row);
        this.getSelectedChapter(row);
    }

    // Get Selected Chapter

    getSelectedChapter(row) {
        var that = this;
        commonfun.loader();

        var _chapterids = null;
        var _chapteritem = null;

        if (row != null) {
            _chapterids = null;
            _chapterids = row.chptrid;

            if (_chapterids != null) {
                for (var i = 0; i < _chapterids.length; i++) {
                    _chapteritem = null;
                    _chapteritem = _chapterids[i];

                    if (_chapteritem != null) {
                        $("#selectall").prop('checked', true);
                        console.log(_chapteritem);
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

    // Cancel Chapter For Exam

    cancelChapterForExam(row) {
        $("#viewChapterModal").modal('hide');
    }

    // Fill Chapter List

    fillChapterList(row) {
        var that = this;
        commonfun.loader();

        that._examservice.getExamDetails({
            "flag": "chapterddl", "classid": that.clsid, "subid": row.subid,
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

        that.selectedExamRow.chptrid = {};

        var _chptrids = "";
        var _chptrnames = "";

        for (var i = 0; i <= that.chapterDT.length - 1; i++) {
            chapteritem = null;
            chapteritem = that.chapterDT[i];

            if (chapteritem !== null) {
                $("#chapter" + chapteritem.chptrid).find("input[type=checkbox]").each(function () {
                    _chptrids += (this.checked ? $(this).val() + "," : "");
                    _chptrnames += (this.checked ? chapteritem.chptrname + "," : "");
                });

                if (_chptrids != "") {
                    that.selectedExamRow.chptrid = "[" + _chptrids.slice(0, -1) + "]";
                    that.selectedExamRow.chptrname = _chptrnames.slice(0, -1);

                    that.selectedExamRow.chptrcount = (_chptrids.match(/,/g) || []).length;
                    $("#viewChapterModal").modal('hide');
                }
                else {
                    that.selectedExamRow.chptrid = null;
                }
            }
        }
    }

    // Save Exam

    isValidExamFields() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        if (that.smstrid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Exam Type");
            $(".smstrname").focus();
            return false;
        }
        if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }

        that.selectedExamList = that.examListDT.filter(a => a.isselsub == true);

        if (that.selectedExamList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Subject");
            return false;
        }

        for (var i = 0; i < that.selectedExamList.length; i++) {
            var exmlstrow = that.selectedExamList[i];

            if (exmlstrow.examdate == "" || exmlstrow.examdate == null) {
                that._msg.Show(messageType.error, "Error", "Enter Exam Date For " + exmlstrow.subname);
                $(".examdate" + exmlstrow.subid).focus();
                return false;
            }
            if (exmlstrow.frmtm == "" || exmlstrow.frmtm == null) {
                that._msg.Show(messageType.error, "Error", "Enter From Time For " + exmlstrow.subname);
                $(".frmtm" + exmlstrow.subid).focus();
                return false;
            }
            if (exmlstrow.totm == "" || exmlstrow.totm == null) {
                that._msg.Show(messageType.error, "Error", "Enter To Time For " + exmlstrow.subname);
                $(".totm" + exmlstrow.subid).focus();
                return false;
            }
            if (exmlstrow.passmarks == "" || exmlstrow.passmarks == null) {
                that._msg.Show(messageType.error, "Error", "Select Passing Marks For " + exmlstrow.subname);
                $(".passmarks" + exmlstrow.subid).focus();
                return false;
            }
            if (exmlstrow.outofmarks == "" || exmlstrow.outofmarks == null) {
                that._msg.Show(messageType.error, "Error", "Select Out Of Marks For " + exmlstrow.subname);
                $(".outofmarks" + exmlstrow.subid).focus();
                return false;
            }
            if (exmlstrow.chptrid == "{}" || exmlstrow.chptrid == null) {
                that._msg.Show(messageType.error, "Error", "Select Atleast 1 Chapter For " + exmlstrow.subname);
                return false;
            }
        }

        return true;
    }

    saveExamInfo() {
        var that = this;

        var _isvalidflds = that.isValidExamFields();
        var _chapterrights = that.getSubjectChapterRights();

        if (_isvalidflds) {
            commonfun.loader();

            var params = {
                "ayid": that.ayid,
                "smstrid": that.smstrid,
                "clsid": that.clsid,
                "examlist": that.selectedExamList,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode
            }

            that._examservice.saveExamInfo(params).subscribe(data => {
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/exam']);
    }
}
