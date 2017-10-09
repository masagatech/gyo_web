import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssesmentService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addass.comp.html',
    providers: [CommonService]
})

export class AddAssesmentComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    classDT: any = [];
    subjectDT: any = [];
    activityDT: any = [];

    assparamid: number = 0;
    assid: number = 0;
    clsid: number = 0;
    asstypid: number = 0;
    heading: string = "";

    subheadList: any = [];
    selectedSubHead: any = [];
    subheadid: number = 0;
    subheadname: string = "";
    iseditsubhead: boolean = false;

    gradeDT: any = [];

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _assservice: AssesmentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillClassAndGradeDropDown();
        this.fillAssesmentTypeDropDown();
    }

    public ngOnInit() {
        this.editAssesmentDetails();
    }

    // Fill Class, Grade And Subject Drop Down

    fillClassAndGradeDropDown() {
        var that = this;
        commonfun.loader();

        that._assservice.getAssesmentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
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

    fillAssesmentTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._assservice.getAssesmentDetails({
            "flag": "asstypeddl", "classid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data.filter(a => a.subtype == "Subject");
                that.activityDT = data.data.filter(a => a.subtype == "Activity");
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

    // Clear Assesment Fields

    resetAssesmentFields() {
        var that = this;

        that.clsid = 0;
        that.asstypid = 0;
        that.heading = "";
        that.subheadList = [];
        that.remark = "";
    }

    // Add Sub Heading

    addSubHeading() {
        var that = this;

        that.subheadList.push({ "subheadname": that.subheadname })

        that.resetSubHeading();
    }

    // Edit Sub Heading

    editSubHeading(row) {
        var that = this;

        that.selectedSubHead = row;
        that.subheadid = row.subheadid;
        that.subheadname = row.subheadname;
        that.iseditsubhead = true;
    }

    // Delete Sub Heading

    deleteSubHeading(row) {
        this.subheadList.splice(this.subheadList.indexOf(row), 1);
    }

    // Update Sub Heading

    updateSubHeading() {
        var that = this;

        that.selectedSubHead.subheadid = that.subheadid;
        that.selectedSubHead.subheadname = that.subheadname;
        that.iseditsubhead = false;

        that.resetSubHeading();
    }

    // Reset Sub Heading

    resetSubHeading() {
        var that = this;
        that.subheadid = 0;
        that.subheadname = "";
        that.iseditsubhead = false;
    }

    // Get Grade Rights

    getGradeRights() {
        var that = this;
        var gradeitem = null;

        var actrights = "";
        var graderights = {};

        for (var i = 0; i <= that.gradeDT.length - 1; i++) {
            gradeitem = null;
            gradeitem = that.gradeDT[i];

            if (gradeitem !== null) {
                $("#grade" + gradeitem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    graderights = actrights.slice(0, -1);
                }
            }
        }

        return graderights;
    }

    // Save Assesment

    saveAssesment() {
        var that = this;
        var _graderights = null;

        _graderights = that.getGradeRights();

        if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
        }
        else if (that.asstypid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Assesment Type");
            $(".asstype").focus();
        }
        else if (that.heading == "") {
            that._msg.Show(messageType.error, "Error", "Enter Heading");
            $(".heading").focus();
        }
        else if (that.subheadList == "") {
            that._msg.Show(messageType.error, "Error", "Please Atleast 1 Sub Heading");
            $(".subheadname").focus();
        }
        else {
            commonfun.loader();

            var _subheadings: string[] = [];
            _subheadings = Object.keys(that.subheadList).map(function (k) { return that.subheadList[k].subheadname });

            var saveassesment = {
                "assid": that.assid,
                "clsid": that.clsid,
                "asstypid": that.asstypid,
                "asstyp": $('.asstype :selected').parent().attr('id'),
                "heading": that.heading,
                "subheading": _subheadings,
                "grdaply": "{" + _graderights + "}",
                "remark": that.remark,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._assservice.saveAssesmentInfo(saveassesment).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_assesmentinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetAssesmentFields();
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

    // Get Assesment

    editAssesmentDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.assparamid = params['id'];
                that.getAssesmentDetails();
            }
            else {
                that.resetAssesmentFields();
                commonfun.loaderhide();
            }
        });
    }

    getAssesmentDetails() {
        var that = this;
        commonfun.loader();

        that._assservice.getAssesmentDetails({
            "flag": "edit", "assid": that.assparamid, "classid": that.clsid, "asstypid": that.asstypid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var viewass = data.data;

                if (viewass.length > 0) {
                    if (that.assparamid !== 0) {
                        that.assid = that.assparamid;
                        that.clsid = viewass[0].clsid;
                        that.fillAssesmentTypeDropDown();
                        that.asstypid = viewass[0].asstypid;
                    }
                    else {
                        that.assid = viewass[0].assid;
                    }

                    that.heading = viewass[0].heading;
                    that.subheadList = viewass[0].subheadlist;

                    var _graderights = null;
                    var _gradeitem = null;

                    if (viewass[0] != null) {
                        _graderights = null;
                        _graderights = viewass[0].grdaply;

                        if (_graderights != null) {
                            for (var i = 0; i < _graderights.length; i++) {
                                _gradeitem = null;
                                _gradeitem = _graderights[i];

                                if (_gradeitem != null) {
                                    $("#selectall").prop('checked', true);
                                    $("#grade" + _gradeitem).find("#" + _gradeitem).prop('checked', true);
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

                    that.remark = viewass[0].remark;
                }
                else {
                    that.heading = "";
                    that.subheadList = [];
                    that.remark = "";
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
        this._router.navigate(['/erp/transaction/assesment']);
    }
}
