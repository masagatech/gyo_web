import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, CommonService } from '@services';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewMOM.comp.html',
    providers: [CommonService]
})

export class ViewMOMComponent implements OnInit, OnDestroy {
    momDT: any = [];
    grpcd: string = "";
    headertitle: string = "";
    selectedGroup: any = [];

    private subscribeParameters: any;
    
    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _commonservice: CommonService, private _msg: MessageService) {
        this.getMOMDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    getMOMDetails() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['grpcd'] !== undefined) {
                that.grpcd = params['grpcd'];

                that._commonservice.getMOM({
                    "flag": "grid", "group": that.grpcd
                }).subscribe(data => {
                    try {
                        that.momDT = data.data;
                        that.headertitle = data.data[0].groupname;
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
        });
    }

    public addMOMForm() {
        this._router.navigate(['/settings/masterofmaster/group', this.grpcd, 'add']);
    }

    public editMOMForm(row) {
        this._router.navigate(['/settings/masterofmaster/group', this.grpcd, 'edit', row.autoid]);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
        
        this.subscribeParameters.unsubscribe();
    }
}