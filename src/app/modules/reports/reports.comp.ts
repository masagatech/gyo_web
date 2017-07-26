import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'reports.comp.html'
})

export class ReportsComponent implements OnDestroy {
    constructor(private _router: Router) {
        let _enttdetails = Cookie.get("_enttdetails_");

        if (_enttdetails == null && _enttdetails == undefined) {
            this._router.navigate(['/master/entity']);
        }
    }

    public ngOnInit() {

    }

    ngOnDestroy() {

    }
}