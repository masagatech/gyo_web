import {
    Component,
    OnInit,
} from '@angular/core';
import { DriverInfoService } from '../../_services/driverinfo/driverinfo-service'

import { LazyLoadEvent } from 'primeng/primeng'

import { Router } from '@angular/router'

declare var $: any;
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
@Component({
    templateUrl: './surveyentries.comp.html',
    providers: [DriverInfoService]
})
export class SurveyEntriesComp implements OnInit {
    datatable_datasource: any = [];
    datatable_totalRecords: number = 0;

    constructor(private _DriverInfoService: DriverInfoService, private _route: Router) {

    }

    public ngOnInit() {

    }

    getGridData(from: number, to: number) {
        var that = this;
        $(".datagrid").waitMe({
            effect: 'pulse',
            text: 'Loading...',
            bg: 'rgba(255,255,255,0.90)',
            color: 'amber'
        });
        that._DriverInfoService.getDriverInfoGrid({ "from": from, "to": to }).subscribe(_d => {
            that.datatable_totalRecords = _d.data[1][0].recordstotal;
            that.datatable_datasource = _d.data[0];

        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {
            // console.log("Complete");
            $(".datagrid").waitMe('hide');
        })
    }

    lazy_load(event: LazyLoadEvent) {
        this.getGridData(event.first, (event.first + event.rows));

    }

    showDetails(row: any) {
        console.log(row);
        var id = row.autoid;
        this._route.navigate(["/surveyentries/details/", id]);
    }
}
