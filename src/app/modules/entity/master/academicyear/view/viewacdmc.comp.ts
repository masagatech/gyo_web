import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AcademicYearService } from '@services/erp';

@Component({
    templateUrl: 'viewacdmc.comp.html',
    providers: [CommonService]
})

export class ViewAcademicYearComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _acdmcservice: AcademicYearService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAcademicYear();
    }

    public ngOnInit() {
        
    }

    // Get Academic Year

    getAcademicYear() {
        var that = this;
        commonfun.loader();

        that._acdmcservice.getAcademicYear({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data;
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

    public addAcademicYear() {
        this._router.navigate(['/master/academicyear/add']);
    }

    public editAcademicYear(row) {
        this._router.navigate(['/master/academicyear/edit', row.ayid]);
    }
}