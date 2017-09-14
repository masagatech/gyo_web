import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, CommonService } from '@services';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';

@Component({
    templateUrl: 'mom.comp.html',
    providers: [CommonService]
})

export class MOMComponent implements OnDestroy {
    momGroupDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _commonservice: CommonService, private _msg: MessageService) {
        this.fillMOMGroup();
    }

    public ngOnInit() {

    }

    fillMOMGroup() {
        var that = this;

        that._commonservice.getMOM({ "flag": "group" }).subscribe(data => {
            that.momGroupDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        })
    }

    public viewMOMForm(row) {
        this._router.navigate(['/settings/masterofmaster/group', row.grpcd]);
    }

    ngOnDestroy() {

    }
}