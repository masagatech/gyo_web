import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addexamres.comp.html',
    providers: [CommonService]
})

export class AddExamResultComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    semesterDT: any = [];
    classDT: any = [];
    subjectDT: any = [];

    studentDT: any = [];
    studsdata: any = [];

    examparamid: number = 0;
    examid: number = 0;
    examresid: number = 0;
    ayid: number = 0;
    smstrid: number = 0;
    clsid: number = 0;
    studid: number = 0;
    studname: string = "";

    examList: any = [];

    private subscribeParameters: any;

    constructor(private _examservice: ExamService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        // this.editexamDetails();
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

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": this.clsid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.studentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.getExamResult();
    }

    // Reset Student

    resetStudentData() {
        this.studid = 0;
        this.studname = "";
        this.studsdata = [];
    }

    // Save Exam Result

    isValidation() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.smstrid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Exam Type");
            $(".smstrname").focus();
            return false;
        }
        else if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select class");
            $(".class").focus();
            return false;
        }
        else if (that.studid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Student Name");
            $(".studname input").focus();
            return false;
        }
        else if (that.examList.length > 0) {
            for (var i = 0; i < that.examList.length; i++) {
                var _examlist = that.examList[i];

                if (_examlist.marks == null || _examlist.marks == "") {
                    that._msg.Show(messageType.error, "Error", "Enter " + _examlist.subname + " Marks");
                    $(".marks" + _examlist.subid).focus();
                    return false;
                }

                if (_examlist.marks > _examlist.outofmarks) {
                    that._msg.Show(messageType.error, "Error", "Enter Marks should be less than Out of Marks in " + _examlist.subname);
                    $(".marks" + _examlist.subid).focus();
                    return false;
                }
            }
        }

        return true;
    }

    saveExamResult() {
        var that = this;
        var _examlist = null;
        var _isvalid: boolean = false;

        _isvalid = that.isValidation();

        if (_isvalid) {
            commonfun.loader();

            for (var i = 0; i < that.examList.length; i++) {
                _examlist = that.examList[i];
                _examlist.ayid = that.ayid;
                _examlist.smstrid = that.smstrid;
                _examlist.clsid = that.clsid;
                _examlist.studid = that.studid;
                _examlist.enttid = that._enttdetails.enttid;
                _examlist.wsautoid = that._enttdetails.wsautoid;
                _examlist.cuid = that.loginUser.ucode;
            }

            var params = {
                "examid": that.examparamid, "ayid": that.ayid, "smstrid": that.smstrid, "clsid": that.clsid, "studid": that.studid,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "examresult": that.examList
            }

            that._examservice.saveExamResult(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_examresult;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.getExamResult();
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

    saveExamResultWithMailSent() {
        var that = this;

        that._autoservice.sendEmail({}).subscribe(data => {
            try {
                that._msg.Show(messageType.success, "Success", "Mail Sent Successfully");
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

    // Get Exam Result

    getExamResult() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamResult({
            "flag": "aded", "examid": that.examparamid, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "ayid": that.ayid, "classid": that.clsid, "smstrid": that.smstrid, "studid": that.studid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.examList = data.data;
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
        this._router.navigate(['/transaction/examresult']);
    }
}
