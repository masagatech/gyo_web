import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssignmentService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addtchrrmrk.comp.html',
    providers: [CommonService]
})

export class AddTeacherRemarkComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    classDT: any = [];
    studentDT: any = [];

    trid: number = 0;
    classid: number = 0;
    remark: string = "";
    issendemail: boolean = false;

    private subscribeParameters: any;

    constructor(private _assnmservice: AssignmentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassDropDown();
        this.fillStudentDropDown();
    }

    public ngOnInit() {
        this.getTeacherRemark();

        setTimeout(function () {

        }, 1000);
    }

    // Fill Class Drop Down and Checkbox List For Student

    fillClassDropDown() {
        var that = this;
        commonfun.loader();

        that._assnmservice.getTeacherRemark({
            "flag": "classddl", "enttid": that._enttdetails.enttid
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

    fillStudentDropDown() {
        var that = this;
        commonfun.loader();

        that._assnmservice.getTeacherRemark({
            "flag": "studentddl", "classid": that.classid, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                that.studentDT = data.data;
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

    // Clear Fields

    resetTeacherRemarkFields() {
        var that = this;

        that.trid = 0;
        that.classid = 0;
        that.remark = "";
        that.clearcheckboxes();
    }

    // Get Student Rights

    getStudentRights() {
        var that = this;
        var studitem = null;

        var actrights = "";
        var studrights = null;

        for (var i = 0; i <= that.studentDT.length - 1; i++) {
            studitem = null;
            studitem = that.studentDT[i];

            if (studitem !== null) {
                $("#stud" + studitem.studid).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    studrights = actrights.slice(0, -1);
                }
                else {
                    studrights = null;
                }
            }
        }

        return studrights;
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

    // Save Teacher Remark

    saveTeacherRemark() {
        var that = this;
        var _studrights = null;

        _studrights = that.getStudentRights();

        if (that.remark == "") {
            that._msg.Show(messageType.error, "Error", "Enter Remark");
            $(".remark").focus();
        }
        else if (that.studentDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Student Entry on this " + that._enttdetails.enttname);
        }
        else if (_studrights == null) {
            that._msg.Show(messageType.error, "Error", "Please Select Student");
        }
        else {
            commonfun.loader();

            var savetr = {
                "trid": that.trid,
                "tchrid": that.loginUser.loginid,
                "remark": that.remark,
                "classid": that.classid,
                "studid": "{" + _studrights + "}",
                "issendemail": that.issendemail,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._assnmservice.saveTeacherRemark(savetr).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_teacherremark;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetTeacherRemarkFields();
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

    // Get Teacher Remark

    getTeacherRemark() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.trid = params['id'];

                that._assnmservice.getTeacherRemark({ "flag": "edit", "trid": that.trid, "wsautoid": that._enttdetails.wsautoid }).subscribe(data => {
                    try {
                        var viewtr = data.data;

                        that.trid = viewtr[0].trid;
                        that.remark = viewtr[0].remark;
                        that.classid = viewtr[0].classid;

                        that.fillStudentDropDown();

                        var _studrights = null;
                        var _studitem = null;

                        if (viewtr[0] != null) {
                            _studrights = null;
                            _studrights = viewtr[0].studid;

                            if (_studrights != null) {
                                for (var i = 0; i < _studrights.length; i++) {
                                    _studitem = null;
                                    _studitem = _studrights[i];

                                    if (_studitem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#stud" + _studitem).find("#" + _studitem).prop('checked', true);
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
                that.resetTeacherRemarkFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/communication/teacherremark']);
    }
}
