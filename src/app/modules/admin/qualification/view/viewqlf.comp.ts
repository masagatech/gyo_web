import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { QualificationService } from '@services/master';

@Component({
    templateUrl: 'viewqlf.comp.html'
})

export class ViewQualificationComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    groupDT: any = [];
    qlfgrpid: number = 0;
    qualificationDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _qlfservice: QualificationService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillQualificationDropDown();
        this.getQualification();
    }

    public ngOnInit() {

    }

    // Fill Qualification DropDown

    fillQualificationDropDown() {
        var that = this;
        commonfun.loader();

        that._qlfservice.getQualificationDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.groupDT = data.data;
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

    // Get Qualification

    getQualification() {
        var that = this;
        commonfun.loader();

        that._qlfservice.getQualificationDetails({ "flag": "all", "qlfgrpid": that.qlfgrpid }).subscribe(data => {
            try {
                that.qualificationDT = data.data;
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

    public addQualification() {
        this._router.navigate(['/admin/qualification/add']);
    }

    public editQualification(row) {
        this._router.navigate(['/admin/qualification/edit', row.qlfid]);
    }
}