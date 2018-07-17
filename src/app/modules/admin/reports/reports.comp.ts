import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    templateUrl: 'reports.comp.html'
})

export class AdminReportsComponent implements OnDestroy {
    constructor() {
        
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}