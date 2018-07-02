import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SubjectMapToTeacherService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { element } from 'protractor';

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

    submaptchrDT: any = [];

    ayDT: any = [];
    classDT: any = [];
    subjectDT: any = [];

    smtid: number = 0;
    ayid: number = 0;

    private subscribeParameters: any;

    constructor(private _smtservice: SubjectMapToTeacherService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAcademicYearDropDown();
    }

    public ngOnInit() {

    }

    // Fill Class Drop Down

    fillAcademicYearDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");
                defayDT = that.ayDT.filter(a => a.iscurrent == true);

                if (defayDT.length > 0) {
                    that.ayid = defayDT[0].key;
                }
                else {
                    that.ayid = 0;
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

    // Auto Completed Teacher

    getTeacherData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "teacher",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
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
        this.getSubjectMapToTeacher();
    }

    // Get Subject Map To Teacher

    getSubjectMapToTeacher() {
        var that = this;
        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "tchrsub", "ayid": that.ayid, "tchrid": that.tchrid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.submaptchrDT = data.data;
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

    // On Change Subject

    onChangeSubject(drow) {
        var that = this;
        var smtrow = null;

        if (drow.ismonsub || drow.istuesub || drow.iswedsub || drow.isthusub || drow.isfrisub || drow.issatsub || drow.issunsub) {
            drow.subid = 1;
        }
        else {
            drow.subid = 0;
        }

        for (var i = 0; i < that.submaptchrDT.length; i++) {
            smtrow = that.submaptchrDT[i];

            if (smtrow.classid != drow.classid && smtrow.frmtm == drow.frmtm && smtrow.totm == drow.totm) {
                if (smtrow.monsubname != "Lunch") {
                    if (drow.ismonsub) {
                        smtrow.ismonsub = null;
                    }
                    else {
                        smtrow.ismonsub = false;
                    }
                }

                if (smtrow.tuesubname != "Lunch") {
                    if (drow.istuesub) {
                        smtrow.istuesub = null;
                    }
                    else {
                        smtrow.istuesub = false;
                    }
                }

                if (smtrow.wedsubname != "Lunch") {
                    if (drow.iswedsub) {
                        smtrow.iswedsub = null;
                    }
                    else {
                        smtrow.iswedsub = false;
                    }
                }

                if (smtrow.thusubname != "Lunch") {
                    if (drow.isthusub) {
                        smtrow.isthusub = null;
                    }
                    else {
                        smtrow.isthusub = false;
                    }
                }

                if (smtrow.frisubname != "Lunch") {
                    if (drow.isfrisub) {
                        smtrow.isfrisub = null;
                    }
                    else {
                        smtrow.isfrisub = false;
                    }
                }

                if (smtrow.satsubname != "Lunch") {
                    if (drow.issatsub) {
                        smtrow.issatsub = null;
                    }
                    else {
                        smtrow.issatsub = false;
                    }
                }

                if (smtrow.sunsubname != "Lunch") {
                    if (drow.issunsub) {
                        smtrow.issunsub = null;
                    }
                    else {
                        smtrow.issunsub = false;
                    }
                }
            }
        }
    }

    // Save Subject Map To Teacher

    saveSubjectMapToTeacher() {
        var that = this;
        var submaptchr = [];

        commonfun.loader();

        submaptchr = that.submaptchrDT.filter(a => a.subid == 1);

        var saveClass = {
            "smtid": that.smtid,
            "tchrid": that.tchrid,
            "submaptchr": submaptchr,
            "cuid": that.loginUser.ucode,
            "ayid": that.ayid,
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
                else {
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

    private clearcheckboxes() {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Get Subject Map To Teacher

    editSubjectMapToTeacher() {
        var that = this;
        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "edit", "smtid": that.smtid, "tchrid": that.tchrid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.smtid = data.data[0].smtid;
                    that.tchrid = data.data[0].tchrid;
                    that.tchrname = data.data[0].tchrname;
                    that.tchrdata.value = that.tchrid;
                    that.tchrdata.label = that.tchrname;

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
