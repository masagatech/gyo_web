import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../../_services/school/school-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: 'viewschool.comp.html',
    providers: [SchoolService]
})

export class ViewSchoolComponent implements OnInit {
    schoolDT: any = [];

    constructor(private _schoolservice: SchoolService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.getSchoolDetails();
    }

    public ngOnInit() {
        setTimeout(function() {
            commonfun.navistyle();
        }, 0);
    }

    getSchoolDetails() {
        var that = this;
        commonfun.loader();

        that._schoolservice.getSchoolDetails({ "flag": "all" }).subscribe(data => {
            that.schoolDT = data.data;
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    public addSchoolForm() {
        this._router.navigate(['/school/add']);
    }

    public editSchoolForm(row) {
        this._router.navigate(['/school/edit', row.autoid]);
    }
}
