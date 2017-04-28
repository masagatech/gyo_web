import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/users/user-service';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewuser.comp.html',
    providers: [UserService]
})

export class ViewUserComponent implements OnInit {
    usersDT: any = [];

    constructor(private _userervice: UserService, private _router: Router, private _msg: MessageService) {
        this.getUserDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getUserDetails() {
        var that = this;
        commonfun.loader();

        that._userervice.getUserDetails({ "flag": "all" }).subscribe(data => {
            try {
                that.usersDT = data.data;
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

    public addUserForm() {
        this._router.navigate(['/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/user/edit', row.uid]);
    }
}
