import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { WorkspaceService } from '../../../_services/workspace/ws-service';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewws.comp.html',
    providers: [WorkspaceService]
})

export class ViewWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;
    WorkspaceDT: any = [];
    
    wsid: number = 0;
    wsname: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _wsservice: WorkspaceService) {
        this.loginUser = this._loginservice.getUser();

        this.getWorkspaceDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);

        this.wsid = 0;
        this.wsname = "";
    }

    getWorkspaceDetails() {
        var that = this;

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({ "flag": "all" }).subscribe(data => {
            try {
                that.WorkspaceDT = data.data;
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

    public addWorkspaceForm() {
        this._router.navigate(['/workspace/add']);
    }

    public editWorkspaceForm(row) {
        this._router.navigate(['/workspace/edit', row.wsautoid]);
    }

    public getMainForm(row) {
        this.loginUser.wsid = row.wsautoid;
        this.loginUser.wsname = row.wsname;

        this._router.navigate(['/']);
    }
}
