import { Component, OnInit } from '@angular/core';
import { BatchService } from '../../../_services/batch/batch-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewbatch.comp.html',
    providers: [BatchService]
})

export class ViewBatchComponent implements OnInit {
    batchDT: any = [];

    constructor(private _batchervice: BatchService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.getBatchDetails();
    }

    public ngOnInit() {
        setTimeout(function() {
            commonfun.navistyle();
        }, 0);
    }

    getBatchDetails() {
        var that = this;
        commonfun.loader();

        that._batchervice.getBatchDetails({ "flag": "all" }).subscribe(data => {
            that.batchDT = data.data;
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    public addBatchForm() {
        this._router.navigate(['/batch/add']);
    }

    public editBatchForm(row) {
        this._router.navigate(['/batch/edit', row.autoid]);
    }
}
