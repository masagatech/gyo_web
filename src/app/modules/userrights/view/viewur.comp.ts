import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../../_services/login/login-service' /* add reference for user */
import { UserService } from '../../../_services/users/user-service' /* add reference for user */
import { LoginUserModel } from '../../../_model/user_model';
import { Router } from '@angular/router';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';

@Component({
    templateUrl: 'viewur.comp.html',
    providers: [UserService]
})

export class ViewUserRightsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    viewUserDT: any[];
    totalRecords: number = 0;

    constructor(private _router: Router, private _userservice: UserService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
    }

    ngOnInit() {

    }

    getUserRights(from: number, to: number) {
        this._userservice.getUserRights({
            "flag": "view", "uid": 1, "from": from, "to": to
            // "uid": this.loginUser.uid, "cmpid": this.loginUser.cmpid, "fy": this.loginUser.fy
        }).subscribe(userrights => {
            this.totalRecords = userrights.data[1].recordstotal;
            this.viewUserDT = userrights.data[0];
        }, err => {
            console.log("Error");
        }, () => {
            // console.log("Complete");
        })
    }

    loadURGrid(event: LazyLoadEvent) {
        this.getUserRights(event.first, (event.first + event.rows));
    }

    openUserRights(row) {
        this._router.navigate(['/userrights/edit', row.uid]);
    }

    addUserRights() {
        this._router.navigate(['/userrights/add']);
    }

    ngOnDestroy() {
        console.log('ngOnDestroy');
    }
}