import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'rollover.comp.html',
    providers: [CommonService]
})

export class RolloverComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    studentDT: any = [];

    autoid: number = 0;

    ayDT: any = [];
    classDT: any = [];

    ayid: number = 0;
    classid: number = 0;
    rollno: number = 0;

    private subscribeParameters: any;

    constructor(private _admsnservice: AdmissionService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getStudentDetails();
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
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

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

    // Clear Fields

    resetStudentFields() {
        var that = this;

        that.classid = 0;
        that.rollno = 0;
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

    isValidStudent() {
        var that = this;
        var isduplicaterollno: boolean = false;

        isduplicaterollno = that.checkIfRollnoIsUnique();

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

        for (var i = 0; i < that.studentDT.length; i++) {
            var _studlist = that.studentDT[i];

            if (_studlist.classid == null || _studlist.classid == 0) {
                that._msg.Show(messageType.error, "Error", "Select " + _studlist.studentname + " Class");
                $(".class" + _studlist.studentid).focus();
                return false;
            }

            if (_studlist.rollno == null || _studlist.rollno == "") {
                that._msg.Show(messageType.error, "Error", "Enter " + _studlist.studentname + " Roll No");
                $(".rollno" + _studlist.studentid).focus();
                return false;
            }
        }

        for (var i = 0; i < that.studentDT.length; i++) {
            var _istudlist = that.studentDT[i];

            for (var j = 0; j < that.studentDT.length; j++) {
                var _jstudlist = that.studentDT[j];

                if (i != j) {
                    var studentid = that.studentDT[i].studentid;
                    var irollno = that.studentDT[i].rollno;
                    var jrollno = that.studentDT[j].rollno;

                    if (irollno == jrollno) {
                        that._msg.Show(messageType.error, "Error", _istudlist.studentname + " and " + _jstudlist.studentname + " Roll No is same");
                        $(".rollno" + _jstudlist.studentid).focus();
                        return false;
                    }
                }
            }
        }

        // if (isduplicaterollno) {
        //     that._msg.Show(messageType.error, "Error", "Duplicate Roll No not Allowed");
        //     return false;
        // }

        return true;
    }

    // Get Student Data

    getStudentDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "rollover", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
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

    saveStudentInfo() {
        var that = this;
        var isvalid: boolean = false;

        isvalid = that.isValidStudent();

        if (isvalid) {
            commonfun.loader();

            that._admsnservice.saveStudentRollover({ "studentrollover": that.studentDT }).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_studentrollover;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.getStudentDetails();
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
}
