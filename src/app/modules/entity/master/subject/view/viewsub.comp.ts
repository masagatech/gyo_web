import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService, SubjectService } from '@services/master';

@Component({
    templateUrl: 'viewsub.comp.html'
})

export class ViewSubjectComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    subtypeDT: any = [];
    subtype: string = "";

    standardDT: any = [];
    stdid: number = 0;

    subjectDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _clsservice: ClassService, private _subservice: SubjectService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillSubTypeDropDown();
        this.getSubjectDetails();
    }

    public ngOnInit() {

    }

    // Fill Subject Type DropDown

    fillSubTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._subservice.getSubjectDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group == "standard");
                that.subtypeDT = data.data.filter(a => a.group == "subtype");
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

    // Get Subject

    getSubjectDetails() {
        var that = this;
        commonfun.loader();

        that._subservice.getSubjectDetails({
            "flag": "all", "stdid": that.stdid, "subtype": that.subtype, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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

    // Save Class Subject

    saveClassSubject() {
        var that = this;

        var _subjects = that.subjectDT.filter(a => a.isclssub == true);
        var _subid = Object.keys(_subjects).map(function (k) { return _subjects[k].subid });

        console.log(_subid);

        var params = {
            "flag": "classsubject", "stdid": that.stdid, "subid": _subid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        commonfun.loader();

        that._clsservice.saveClassInfo(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_classinfo;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getSubjectDetails();
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

    public addSubject() {
        this._router.navigate(['/master/subject/add']);
    }

    public editSubject(row) {
        this._router.navigate(['/master/subject/edit', row.subid]);
    }
}