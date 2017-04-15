import {
    Component,
    OnInit,
} from '@angular/core';
import { DriverInfoService } from '../../../_services/driverinfo/driverinfo-service'

import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs/Subscription';

declare var $: any;
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
@Component({
    templateUrl: './surveydetails.comp.html'
})
export class SurveyDetailsComp implements OnInit {
    autoid: any;
    subscribeParameters: Subscription;
    constructor(private _DriverInfoService: DriverInfoService, private _param: ActivatedRoute) {
        this.subscribeParameters = this._param.params.subscribe(params => {

            this.autoid = params['id'];
            
        });
    }

    public ngOnInit() {
        this.getDriverInfoDetail(this.autoid);
    }
    data: any = {};
    getDriverInfoDetail(autoid: any) {
        var that = this;
        $(".details").waitMe({
            effect: 'pulse',
            text: 'Loading...',
            bg: 'rgba(255,255,255,0.90)',
            color: 'amber'
        });
        that._DriverInfoService.getDriverInfoDetail({ "autoid": autoid }).subscribe(_d => {
            that.data = _d.data[0];
            //$(".details").waitMe('hide');
        }, err => {

            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {
            // console.log("Complete");
           $(".details").waitMe('hide');
        })
    }


    showDetails(row: any) {

    }
}
