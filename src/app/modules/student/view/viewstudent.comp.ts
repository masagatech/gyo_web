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
    studentDT: any = [];

    constructor(private _studentervice: StudentService, private _router: Router) {
        this.getStudentDetail();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getStudentDetail() {
        var that = this;
        commonfun.loader();

        that._studentervice.getStudentDetail({ "flag": "all" }).subscribe(data => {
            that.studentDT = data.data;
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    public addStudentForm() {
        this._router.navigate(['/student/add']);
    }

    public editStudentForm(row) {
        this._router.navigate(['/student/edit', row.autoid]);
    }
}
