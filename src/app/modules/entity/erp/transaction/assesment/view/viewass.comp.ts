import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssesmentService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewass.comp.html',
    providers: [CommonService]
})

export class ViewAssesmentComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    assesmentDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _assmservice: AssesmentService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAssesmentDetails();
    }

    public ngOnInit() {

    }

    getAssesmentDetails() {
        var that = this;
        commonfun.loader();

        that._assmservice.getAssesmentDetails({
            "flag": "all", "enttid": that._enttdetails.enttid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                that.assesmentDT = data.data;
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

    public addAssesment() {
        this._router.navigate(['/erp/transaction/assesment/add']);
    }

    public editAssesment(row) {
        this._router.navigate(['/erp/transaction/assesment/edit', row.assid]);
    }
}
