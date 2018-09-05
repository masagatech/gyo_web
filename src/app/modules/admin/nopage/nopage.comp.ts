import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'nopage.comp.html'
})

export class NoPageComponent implements OnInit, OnDestroy {
    previousUrl: string = "";

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute) {
        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.previousUrl = params['url'] || "";
        });
    }

    ngOnInit() {

    }

    public getPreviousUrl() {
        return this.previousUrl;
    }

    backViewData() {
        this._router.navigate([this.previousUrl]);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}