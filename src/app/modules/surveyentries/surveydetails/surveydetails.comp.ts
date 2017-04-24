import { Component, OnInit } from '@angular/core';
import { DriverInfoService } from '../../../_services/driverinfo/driverinfo-service'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: './surveydetails.comp.html'
})

export class SurveyDetailsComp implements OnInit {
    autoid: any;
    subscribeParameters: Subscription;

    constructor(private _driverinfoservice: DriverInfoService, private _param: ActivatedRoute) {
        this.subscribeParameters = this._param.params.subscribe(params => {
            this.autoid = params['id'];
        });
    }

    public ngOnInit() {
        this.getDriverDetails(this.autoid);
    }
    
    data: any = {};

    getDriverDetails(autoid: any) {
        var that = this;
        $(".details").waitMe({
            effect: 'pulse',
            text: 'Loading...',
            bg: 'rgba(255,255,255,0.90)',
            color: 'amber'
        });
        that._driverinfoservice.getDriverInfoDetails({ "autoid": autoid }).subscribe(_d => {
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
}
