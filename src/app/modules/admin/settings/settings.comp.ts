import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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