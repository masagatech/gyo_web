import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

@Component({
    templateUrl: 'mngrlno.comp.html'
})

export class ManageRollnoComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    studentDT: any = [];

    ayDT: any = [];
    classDT: any = [];
    genderDT: any = [];

    ayid: number = 0;
    classid: number = 0;
    gndrtype: string = "";
    nametype: string = "fname";

    constructor(private _router: Router, private _routeParams: ActivatedRoute, private _msg: MessageService,
        private _loginservice: LoginService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getManageRollNo();
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

    // Valid For Manage Roll No

    isValidManageRollNo(_studentdt) {
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

        for (var i = 0; i < _studentdt.length; i++) {
            var _istudlist = _studentdt[i];

            for (var j = 0; j < _studentdt.length; j++) {
                var _jstudlist = _studentdt[j];

                if (i != j) {
                    var irollno = _studentdt[i].newrollno;
                    var jrollno = _studentdt[j].newrollno;

                    if (irollno == jrollno) {
                        that._msg.Show(messageType.error, "Error", _istudlist.studentname + " and " + _jstudlist.studentname + " Roll No is same");
                        $(".rollno" + _jstudlist.studentid).focus();
                        return false;
                    }
                }
            }
        }

        return true;
    }

    // Save Manage Roll No

    saveManageRollNo() {
        var that = this;
        var isvalid: boolean = false;

        var params = {};
        var _studentdt = [];

        _studentdt = that.studentDT.filter(a => a.newrollno != "").filter(a => a.newrollno != "0");

        isvalid = that.isValidManageRollNo(_studentdt);

        if (isvalid) {
            commonfun.loader();

            params = {
                "flag": "manage_rollno",
                "ayid": that.ayid,
                "classid": that.classid,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "managerollno": _studentdt
            }

            that._admsnservice.saveStudentRollover(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_studentrollover;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.getManageRollNo();
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

    // Get Manage Roll No

    getManageRollNo() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "getrollno", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "gndrtype": that.gndrtype, "nametype": that.nametype, "ayid": that.ayid, "classid": that.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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
