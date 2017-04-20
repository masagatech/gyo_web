import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../_services/student/student-service';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewstudent.comp.html',
    providers: [StudentService]
})

export class ViewStudentComponent implements OnInit {
    constructor(private _studentervice: StudentService, private _route: Router) {

    }

    public ngOnInit() {

    }
}
