import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'module.comp.html'
})

export class ModuleComponent implements OnDestroy {
    constructor(private _router: Router) {
        let sessionid = Cookie.get('_session_');
        let _wsdetails = Cookie.get("_wsdetails_");

        if (sessionid == null && sessionid == undefined) {
            this._router.navigate(['/login']);
        }

        if (_wsdetails == null && _wsdetails == undefined) {
            this._router.navigate(['/workspace']);
        }
    }

    public ngOnInit() {

    }

    ngOnDestroy() {

    }
}