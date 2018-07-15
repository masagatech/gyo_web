import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';

@Component({
    templateUrl: 'addexgrd.comp.html'
})

export class AddExamGradeComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    classDT: any = [];
    gradeDT: any = [];
    examGradeList: any = [];
    selectedExamGradeRow: any = {};

    isaddexgrd: boolean = false;
    iseditexgrd: boolean = false;

    exgrdid: number = 0;
    clsid: number = 0;
    docno: number = 0;
    totmarks: any = "";
    frmmarks: any = "";
    tomarks: any = "";
    grade: number = 0;

    private subscribeParameters: any;

    constructor(private _examservice: ExamService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getExamGradeList();
    }

    // Select CheckBoxes For Class

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    // Clear CheckBoxes For Class

    private clearcheckboxes() {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Get Class Rights

    getClassRights() {
        var that = this;
        var clsitem = null;

        var actrights = "";
        var clsrights = null;

        for (var i = 0; i <= that.classDT.length - 1; i++) {
            clsitem = null;
            clsitem = that.classDT[i];

            if (clsitem !== null) {
                $("#cls" + clsitem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    clsrights = actrights.slice(0, -1);
                }
                else {
                    clsrights = null;
                }
            }
        }

        return clsrights;
    }

    // Fill Class And Grade Down

    fillDropDownList() {
        var that = this;

        commonfun.loader();

        that._examservice.getExamGrade({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data.filter(a => a.group == "class");
                that.gradeDT = data.data.filter(a => a.group == "grade");
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

    // Add Exam Grade

    isValidAddExamGrade() {
        var that = this;

        if (that.frmmarks == 0) {
            that._msg.Show(messageType.warn, "Warning", "Enter From Marks");
            return false;
        }

        if (that.tomarks == 0) {
            that._msg.Show(messageType.warn, "Warning", "Enter To Marks");
            return false;
        }

        if (that.grade == 0) {
            that._msg.Show(messageType.warn, "Warning", "Select Grade");
            return false;
        }

        for (var i = 0; i < that.examGradeList.length; i++) {
            var exgrdrow = that.examGradeList[i];
            var rowfrmmarks = parseInt(exgrdrow.frmmarks);
            var rowtomarks = parseInt(exgrdrow.tomarks);
            var selfrmmarks = parseInt(that.frmmarks);
            var seltomarks = parseInt(that.tomarks);

            if (selfrmmarks > rowfrmmarks && selfrmmarks <= rowtomarks) {
                that._msg.Show(messageType.warn, "Warning", selfrmmarks + " To " + seltomarks + " Already Exists !!!!");
                return false;
            }

            if (seltomarks > rowfrmmarks && seltomarks <= rowtomarks) {
                that._msg.Show(messageType.warn, "Warning", selfrmmarks + " To " + seltomarks + " Already Exists !!!!");
                return false;
            }
        }

        return true;
    }

    // Add Exam Grade

    addExamGrade() {
        var that = this;
        var isvalidexgrd = that.isValidAddExamGrade();

        if (isvalidexgrd) {
            var gradename = $("#ddlgrade option:selected").text().trim();

            that.examGradeList.push({
                "exgrdid": "0",
                "frmmarks": that.frmmarks,
                "tomarks": that.tomarks,
                "grade": that.grade,
                "gradename": gradename
            })

            that.cancelExamGrade();
        }
    }

    // Edit Exam Grade

    editExamGrade(row) {
        var that = this;
        commonfun.loader();

        try {
            that.selectedExamGradeRow = row;

            that.exgrdid = row.exgrdid;
            that.frmmarks = row.frmmarks;
            that.tomarks = row.tomarks;
            that.grade = row.grade;

            that.isaddexgrd = false;
            that.iseditexgrd = true;

            commonfun.loaderhide();
        }
        catch (e) {
            that._msg.Show(messageType.error, "Error", e);
            commonfun.loaderhide();
        }
    }

    // Update Exam Grade

    updateExamGrade(row) {
        var that = this;
        commonfun.loader();

        try {
            var isvalidexgrd = false;

            if (that.iseditexgrd == true) {
                isvalidexgrd = true;
            }
            else {
                isvalidexgrd = that.isValidAddExamGrade();
            }

            if (isvalidexgrd) {
                var gradename = $("#ddlgrade option:selected").text().trim();

                that.selectedExamGradeRow.exgrdid = that.exgrdid;
                that.selectedExamGradeRow.frmmarks = that.frmmarks;
                that.selectedExamGradeRow.tomarks = that.tomarks;
                that.selectedExamGradeRow.grade = that.grade;
                that.selectedExamGradeRow.gradename = gradename;

                that.cancelExamGrade();
            }

            commonfun.loaderhide();
        }
        catch (e) {
            that._msg.Show(messageType.error, "Error", e);
            commonfun.loaderhide();
        }
    }

    // Cancel Exam Grade

    cancelExamGrade() {
        var that = this;

        that.isaddexgrd = true;
        that.iseditexgrd = false;

        that.exgrdid = 0;
        that.frmmarks = "";
        that.tomarks = "";
        that.grade = 0;
    }

    // Clear Exam Fields

    resetExamGradeFields() {
        var that = this;

        that.clsid = 0;
        that.totmarks = 0;
        that.docno = 0;

        that.cancelExamGrade();
    }

    // Save Exam Grade

    isValidExamGradeFields(_clsrights) {
        var that = this;

        if (that.totmarks == "") {
            that._msg.Show(messageType.error, "Error", "Enter Total Marks");
            $(".totmarks").focus();
            return false;
        }
        if (_clsrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select Atleast 1 Class");
        }

        return true;
    }

    saveExamGrade() {
        var that = this;

        var _clsrights = null;
        _clsrights = that.getClassRights();

        var _isvalidflds = that.isValidExamGradeFields(_clsrights);

        if (_isvalidflds) {
            commonfun.loader();

            var params = {
                "clsids": _clsrights,
                "totmarks": that.totmarks,
                "docno": that.docno,
                "examgradelist": that.examGradeList,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode
            }

            that._examservice.saveExamGrade(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_examgrade;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetExamGradeFields();
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

    // Get Exam Grade List

    getExamGradeList() {
        var that = this;

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.docno = params['id'];
                commonfun.loader();

                that._examservice.getExamGrade({
                    "flag": "edit", "docno": that.docno, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }).subscribe(data => {
                    try {
                        var viewexgrd = data.data;

                        if (viewexgrd.length > 0) {
                            that.totmarks = viewexgrd[0].totmarks;

                            var _clsrights = null;
                            var _clsitem = null;

                            _clsrights = null;
                            _clsrights = viewexgrd[0].clsids;

                            if (_clsrights != null) {
                                for (var i = 0; i < _clsrights.length; i++) {
                                    _clsitem = null;
                                    _clsitem = _clsrights[i];

                                    if (_clsitem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#cls" + _clsitem).find("#" + _clsitem).prop('checked', true);
                                    }
                                    else {
                                        $("#selectall").prop('checked', false);
                                    }
                                }
                            }
                            else {
                                $("#selectall").prop('checked', false);
                            }

                            that.docno = data.data[0].docno;
                            that.examGradeList = data.data[0].gradelist;

                            that.isaddexgrd = true;
                            that.iseditexgrd = false;
                        }
                        else {
                            that.resetExamGradeFields();
                            that.examGradeList = [];
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
                that.resetExamGradeFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/examgrade']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
