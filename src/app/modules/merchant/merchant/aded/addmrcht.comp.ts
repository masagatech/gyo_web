import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { MerchantService } from '@services/merchant';
import { LoginUserModel } from '@models';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addmrcht.comp.html'
})

export class AddMerchantComponent implements OnInit {
    loginUser: LoginUserModel;

    mrchtid: number = 0;
    mrchtnm: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _mrchtservice: MerchantService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        var that = this;
        this.getMerchantDetails();
    }

    // Clear Fields

    resetMerchantFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Save Data

    saveMerchantInfo() {
        
    }

    // Get Merchant Data

    getMerchantDetails() {
        
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/merchant']);
    }
}