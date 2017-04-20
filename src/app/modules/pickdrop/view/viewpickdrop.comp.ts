import { Component, OnInit } from '@angular/core';
import { PickDropService } from '../../../_services/pickdrop/pickdrop-service';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewpickdrop.comp.html',
    providers: [PickDropService]
})

export class ViewPickDropComponent implements OnInit {
    constructor(private _pickdropervice: PickDropService, private _route: Router) {

    }

    public ngOnInit() {

    }
}
