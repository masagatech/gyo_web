import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../../_services/owner/owner-service';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: 'viewowner.comp.html',
    providers: [OwnerService]
})

export class ViewOwnerComponent implements OnInit {
    ownerDT: any = [];

    constructor(private _ownerservice: OwnerService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.getOwnerDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getOwnerDetails() {
        var that = this;
        commonfun.loader();

        that._ownerservice.getOwnerDetails({ "flag": "all" }).subscribe(data => {
            try {
                that.ownerDT = data.data;
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

    public addOwnerForm() {
        this._router.navigate(['/owner/add']);
    }

    public editOwnerForm(row) {
        this._router.navigate(['/owner/edit', row.autoid]);
    }
}
