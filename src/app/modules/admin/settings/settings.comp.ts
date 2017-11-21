import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'settings.comp.html'
})

export class AdminSettingsComponent implements OnDestroy {
    constructor(private _router: Router) {
        
    }

    public ngOnInit() {

    }

    ngOnDestroy() {

    }
}