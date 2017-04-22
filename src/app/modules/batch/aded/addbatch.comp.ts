import { Component, OnInit } from '@angular/core';
import { BatchService } from '../../../_services/batch/batch-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../_const/globals';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addbatch.comp.html',
    providers: [BatchService, CommonService]
})

export class AddBatchComponent implements OnInit {
    batchid: number = 0;
    batchcode: string = "";
    batchname: string = "";

    schoolDT: any = [];
    schoolid: number = 0;
    schoolname: string = "";

    fromtime: any = "";
    totime: any = "";
    instruction: string = "";

    weekDT: any = [];
    selectedWeek: string[] = [];

    private subscribeParameters: any;

    constructor(private _batchervice: BatchService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            this.batchid = params['id'];
            this.getBatchDetail(this.batchid);
        });
    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._batchervice.getBatchDetail({ "flag": "dropdown" }).subscribe(data => {
            var d = data.data;

            that.schoolDT = d.filter(a => a.group === "school");
            that.weekDT = d.filter(a => a.group === "week");
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Save Data

    saveBatchInfo() {
        var that = this;

        var savebatch = {
            "autoid": that.batchid,
            "batchcode": that.batchcode,
            "batchname": that.batchname,
            "schoolid": that.schoolid,
            "fromtime": that.fromtime,
            "totime": that.totime,
            "uid": "vivek",
            "instruction": that.instruction,
            "weekallow": that.selectedWeek
        }

        this._batchervice.saveBatchInfo(savebatch).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_batchinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_batchinfo.msg;

                alert(msg);
                commonfun.loader();
                commonfun.loaderhide();
                // this._msg.Show(messageType.success, "Success", msg);
                this._router.navigate(['/batch']);
            }
            else {
                var msg = dataResult[0].funsave_batchinfo.msg;
                alert(msg);
                commonfun.loaderhide();
                // this._msg.Show(messageType.error, "Error", msg);
            }
        }, err => {
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get Batch Data
    
    getBatchDetail(bid) {
        var that = this;
        commonfun.loader();

        that._batchervice.getBatchDetail({ "flag": "edit", "id": bid }).subscribe(data => {
            that.batchid = data.data[0].autoid;
            that.batchcode = data.data[0].batchcode;
            that.batchname = data.data[0].batchname;
            that.schoolid = data.data[0].schoolid;
            that.fromtime = data.data[0].fromtime;
            that.totime = data.data[0].totime;
            that.instruction = data.data[0].instruction;
            that.selectedWeek = data.data[0].weekallow !== null ? data.data[0].weekallow : [];
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/batch']);
    }
}
