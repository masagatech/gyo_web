import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

@Component({
    templateUrl: 'chstd.comp.html'
})

export class ChangeStandardComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    studentDT: any = [];

    ayDT: any = [];
    classDT: any = [];
    classRowDT: any = [];

    ayid: number = 0;
    classid: number = 0;

    constructor(private _router: Router, private _routeParams: ActivatedRoute, private _msg: MessageService,
        private _loginservice: LoginService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getChangeStandard();
    }

    public ngOnInit() {

    }

    // Fill Academic Year And Class DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (sessionStorage.getItem("_ayid_") != null) {
                        that.ayid = parseInt(sessionStorage.getItem("_ayid_"));
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

                that.classDT = data.data.filter(a => a.group == "class");
                that.classRowDT = data.data.filter(a => a.group == "class");
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

    // Copy Across Class

    copyAcrossClass() {
        var selectedStudentDT = [];

        selectedStudentDT = this.studentDT.filter(a => a.classid !== 0);

        if (selectedStudentDT[0].classid == 0) {
            this._msg.Show(messageType.error, "Error", "Select Atleast 1 Class");
        }
        else {
            for (var i = 0; i < this.studentDT.length; i++) {
                var stdflds = this.studentDT[i];
                stdflds.classid = selectedStudentDT[0].classid;
            }
        }
    }

    // Save Data

    checkIfRollnoIsUnique() {
        var that = this;

        for (var i = 0; i < that.studentDT.length; i++) {
            for (var j = 0; j < that.studentDT.length; j++) {
                if (i != j) {
                    var studentid = that.studentDT[i].studentid;
                    var irollno = that.studentDT[i].rollno;
                    var jrollno = that.studentDT[j].rollno;

                    if (irollno == jrollno) {
                        $(".rollno" + studentid).focus();
                        return true; // means there are duplicate values
                    }
                }
            }
        }

        return false; // means there are no duplicate values.
    }

    isValidChangeStandard(_studentdt) {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }

        if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }

        if (_studentdt.length == 0) {
            that._msg.Show(messageType.error, "Error", "No Student Details");
            return false;
        }

        return true;
    }

    // Save Change Standard

    saveChangeStandard() {
        var that = this;
        var isvalid: boolean = false;

        var params = {};
        var _studentdt = [];

        _studentdt = that.studentDT.filter(a => a.classid != that.classid).filter(a => a.classid != "");

        isvalid = that.isValidChangeStandard(_studentdt);

        if (isvalid) {
            commonfun.loader();

            params = {
                "flag": "change_standard",
                "ayid": that.ayid,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "changestandard": _studentdt
            }

            that._admsnservice.saveStudentRollover(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_studentrollover;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.getChangeStandard();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide();
            }, err => {
                console.log(err);
                that._msg.Show(messageType.error, "Error", err);

                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Change Standard

    getChangeStandard() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "getstandard", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        };

        that._admsnservice.getStudentDetails(params).subscribe(data => {
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
            commonfun.loaderhide("#fltrstud");
        }, () => {

        })
    }
}
