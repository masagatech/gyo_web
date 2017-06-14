import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
declare var loader: any;

@Component({
    selector: '<rightsidebar></rightsidebar>',
    templateUrl: 'rightsidebar.comp.html'
})

export class RightSideBarComponent implements OnInit, OnDestroy {
    public angularclassLogo = 'assets/img/angularclass-avatar.png';
    public name = 'Angular 2 Webpack Starter';
    public url = 'https://twitter.com/AngularClass';

    private themes: any = [
        { nm: 'red', disp: 'Red' },
        { nm: 'pink', disp: 'pink' },
        { nm: 'purple', disp: 'purple' },
        { nm: 'deep-purple', disp: 'Deep Purple' },
        { nm: 'indigo', disp: 'indigo' },
        { nm: 'blue', disp: 'blue' },
        { nm: 'light-blue', disp: 'Light Blue' },
        { nm: 'cyan', disp: 'cyan' },
        { nm: 'teal', disp: 'teal' },
        { nm: 'green', disp: 'green' },
        { nm: 'light-green', disp: 'Light Green' },
        { nm: 'lime', disp: 'lime' },
        { nm: 'yellow', disp: 'yellow' },
        { nm: 'amber', disp: 'amber' },
        { nm: 'orange', disp: 'orange' },
        { nm: 'deep-orange', disp: 'deep-orange' },
        { nm: 'brown', disp: 'brown' },
        { nm: 'grey', disp: 'grey' },
        { nm: 'blue-grey', disp: 'blue-grey' },
        { nm: 'black', disp: 'black' }
    ];

    constructor() {

    }

    private changeSkin(theme: any) {
        loader.skinChanger(theme);
    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
    }
}