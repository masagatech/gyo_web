import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SubjectService } from '@services/master';

@Component({
    templateUrl: 'viewsub.comp.html'
})

export class ViewSubjectComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    subtypeDT: any = [];
    subtype: string = "";
    subjectDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _subservice: SubjectService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillSubTypeDropDown();
        this.getSubject();
    }

    public ngOnInit() {

    }

    // Fill Subject Type DropDown

    fillSubTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._subservice.getSubjectDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.subtypeDT = data.data;
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

    getSubject() {
        var that = this;
        commonfun.loader();

        that._subservice.getSubjectDetails({ "flag": "all", "subtype": that.subtype }).subscribe(data => {
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

    public addSubject() {
        this._router.navigate(['/admin/subject/add']);
    }

    public editSubject(row) {
        this._router.navigate(['/admin/subject/edit', row.subid]);
    }
}