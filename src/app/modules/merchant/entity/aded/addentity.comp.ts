import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { EntityService } from '@services/merchant';
import { LoginUserModel } from '@models';
import { Globals } from '../../../../_const/globals';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addentity.comp.html',
    providers: [EntityService]
})

export class AddEntityComponent implements OnInit {
    loginUser: LoginUserModel;

    enttid: number = 0;
    enttnm: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _entityservice: EntityService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        var that = this;
        this.getEntityDetails();
    }

    // Clear Fields

    resetEntityFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Save Data

    saveEntityInfo() {
        
    }

    // Get Entity Data

    getEntityDetails() {
        
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/merchant/entity']);
    }
}