import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event as NavigationEvent } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'module.comp.html',
})

export class ModuleComponent implements OnDestroy {
    subscription: Subscription;
    // ActionButtons: ActionBtnProp[] = [];
    // eventActDetails: Details;
    title: string = "";
  
    constructor(router: Router) {

        router.events.forEach((event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
                commonfun.loader();
            }

            if (event instanceof NavigationEnd) {
                commonfun.loaderhide();
            }

            if (event instanceof NavigationError) {
                commonfun.loaderhide();
            }

            if (event instanceof NavigationCancel) {
                commonfun.loaderhide();
            }
        });
    }

    ngOnInit() {
      
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }
}