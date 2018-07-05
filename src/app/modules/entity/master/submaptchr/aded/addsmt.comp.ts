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
    paramtchrid: number = 0;
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
        this.editSubjectMapToTeacher();
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

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
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
                if (that.paramtchrid !== 0) {
                    that.tchrname = data.data[0].tchrname;

                    that.tchrdata = {
                        value: that.tchrid,
                        label: that.tchrname
                    }
                }

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

    editSubjectMapToTeacher() {
        var that = this;

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramtchrid = params['id'];
                that.tchrid = that.paramtchrid;

                $(".tchrname input").attr("disabled", "disabled")
                that.getSubjectMapToTeacher();
            }
            else {
                $(".tchrname input").removeAttr("disabled");
            }
        });
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/subjectmaptoteacher']);
    }
}
