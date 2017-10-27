import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    templateUrl: 'module.comp.html'
})

export class ModuleComponent implements OnDestroy {
    constructor() {
        
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}