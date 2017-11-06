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
    studid: number = 0;
    studname: string = "";

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

        that.studid = 0;
        that.studname = "";
        that.classid = 0;
        that.rollno = 0;
    }
    
    // Save Data

    isValidStudent() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.studname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Student Name");
            $(".studname").focus();
            return false;
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }
        else if (that.rollno == 0) {
            that._msg.Show(messageType.error, "Error", "Select Roll No");
            $(".rollno").focus();
            return false;
        }

        return true;
    }

    saveStudentInfo() {
        var that = this;
        var isvalid: boolean = false;

        isvalid = that.isValidStudent();

        if (isvalid) {
            commonfun.loader();

            var saveStudent = {
                "autoid": that.autoid,
                "ayid": that.ayid,
                "schoolid": that._enttdetails.enttid,
                "studentid": that.studid,
                "classid": that.classid,
                "rollno": that.rollno,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "mode": ""
            }

            that._admsnservice.saveStudentInfo(saveStudent).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_studentinfo.msg;
                    var msgid = dataResult[0].funsave_studentinfo.msgid;

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

    // Get Student Data

    getStudentDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "rollover", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
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
