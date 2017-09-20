import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SubjectMapToTeacherService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewsmt.comp.html',
    providers: [CommonService]
})

export class ViewSubjectMapToTeacherComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    submaptchrDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _smtservice: SubjectMapToTeacherService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getSubjectMapToTeacher();
    }

    public ngOnInit() {

    }

    getSubjectMapToTeacher() {
        var that = this;
        commonfun.loader();

        that._smtservice.getSubjectMapToTeacher({
            "flag": "all", "enttid": that._enttdetails.enttid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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

    public addSubjectMapToTeacher() {
        this._router.navigate(['/master/subjectmaptoteacher/add']);
    }

    public editSubjectMapToTeacher(row) {
        this._router.navigate(['/master/subjectmaptoteacher/edit', row.smtid]);
    }
}
