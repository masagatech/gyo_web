import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssignmentService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewassnm.comp.html',
    providers: [CommonService]
})

export class ViewAssignmentComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    assignmentDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _assmservice: AssignmentService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getAssignmentDetails();
    }

    public ngOnInit() {

    }

    getAssignmentDetails() {
        var that = this;
        commonfun.loader();

        that._assmservice.getAssignmentDetails({
            "flag": "all", "enttid": that._enttdetails.enttid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.assignmentDT = data.data;
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

    public addAssignment() {
        this._router.navigate(['/erp/assignment/add']);
    }

    public editAssignment(row) {
        this._router.navigate(['/erp/assignment/edit', row.assnmid]);
    }
}
