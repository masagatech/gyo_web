import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExamService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewexamres.comp.html',
    providers: [CommonService]
})

export class ViewExamResultComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    examDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _examservice: ExamService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getExamResult();
    }

    public ngOnInit() {

    }

    getExamResult() {
        var that = this;
        commonfun.loader();

        that._examservice.getExamResult({
            "flag": "all", "enttid": that._enttdetails.enttid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.examDT = data.data;
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

    public addExamResult() {
        this._router.navigate(['/erp/transaction/examresult/add']);
    }

    public editExamResult(row) {
        this._router.navigate(['/erp/transaction/examresult/edit', row.examresid]);
    }
}
