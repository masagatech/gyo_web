import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssignmentService } from '@services/erp';

@Component({
    templateUrl: 'viewtchrrmrk.comp.html'
})

export class ViewTeacherRemarkComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    teacherRemarkDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _assnmservice: AssignmentService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getTeacherRemark();
    }

    public ngOnInit() {

    }

    // Teacher Remark

    getTeacherRemark() {
        var that = this;
        commonfun.loader();

        that._assnmservice.getTeacherRemark({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "tchrid": 0, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.teacherRemarkDT = data.data;
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

    public addTeacherRemark() {
        this._router.navigate(['/communication/teacherremark/add']);
    }

    public editTeacherRemark(row) {
        this._router.navigate(['/communication/teacherremark/edit', row.trid]);
    }
}
