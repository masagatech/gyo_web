import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../_services/company/cmp-service';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewcmp.comp.html',
    providers: [CompanyService]
})

export class ViewCompanyComponent implements OnInit {
    companyDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _cmpservice: CompanyService) {
        this.getCompanyDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getCompanyDetails() {
        var that = this;

        commonfun.loader();

        that._cmpservice.getCompanyDetails({ "flag": "all" }).subscribe(data => {
            try {
                that.companyDT = data.data;
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

    public addCompanyForm() {
        this._router.navigate(['/company/add']);
    }

    public editCompanyForm(row) {
        this._router.navigate(['/company/edit', row.cmpautoid]);
    }
}
