import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserMenuMapService } from '@services/master';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';

@Component({
    templateUrl: 'viewumm.comp.html'
})

export class ViewUserMenuMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    viewUserDT: any[];
    totalRecords: number = 0;

    constructor(private _router: Router, private _ummservice: UserMenuMapService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
    }

    ngOnInit() {

    }

    getUserRights(from: number, to: number) {
        this._ummservice.getUserRights({
            "flag": "view", "uid": 1, "from": from, "to": to
            // "uid": this.loginUser.uid, "cmpid": this.loginUser.cmpid, "fy": this.loginUser.fy
        }).subscribe(userrights => {
            this.totalRecords = userrights.data[1].recordstotal;
            this.viewUserDT = userrights.data[0];
        }, err => {
            console.log(err);
        }, () => {
        })
    }

    loadURGrid(event: LazyLoadEvent) {
        this.getUserRights(event.first, (event.first + event.rows));
    }

    openUserRights(row) {
        this._router.navigate(['/settings/usermenumap/edit', row.uid]);
    }

    addUserRights() {
        this._router.navigate(['/settings/userrights/add']);
    }

    ngOnDestroy() {
    }
}