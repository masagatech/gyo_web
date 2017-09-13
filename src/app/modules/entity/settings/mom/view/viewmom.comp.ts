import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, messageType, CommonService } from '@services';
import { Router } from '@angular/router';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewMOM.comp.html',
    providers: [CommonService]
})

export class ViewMOMComponent implements OnInit, OnDestroy {
    momGroupDT: any = [];
    momDT: any = [];
    headertitle: string = "";
    selectedGroup: any = [];

    constructor(private _router: Router, private _commonservice: CommonService, private _msg: MessageService) {
        this.fillMOMGroup();
        
        if (Cookie.get('_groupdt_') != null) {
            this.selectedGroup = JSON.parse(Cookie.get('_groupdt_'));
            this.BindMOMGrid(this.selectedGroup);
        }
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
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

    BindMOMGrid(row) {
        var that = this;
        Cookie.set("_groupdt_", JSON.stringify(row));

        if (Cookie.get('_groupdt_') != null) {
            that.selectedGroup = JSON.parse(Cookie.get('_groupdt_'));

            that._commonservice.getMOM({
                "flag": "grid", "group": that.selectedGroup.grpcd
            }).subscribe(data => {
                try {
                    that.headertitle = that.selectedGroup.grpnm;
                    that.momDT = data.data;
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
    }

    public addMOMForm() {
        this._router.navigate(['/settings/masterofmaster/add']);
    }

    public editMOMForm(row) {
        this._router.navigate(['/settings/masterofmaster/edit', row.autoid]);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}