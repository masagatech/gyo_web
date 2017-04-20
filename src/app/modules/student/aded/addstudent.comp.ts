import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../_services/student/student-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../_const/globals';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;
declare var Dropzone: any;
@Component({
    templateUrl: 'addstudent.comp.html',
    providers: [StudentService, CommonService]
})

export class AddStudentComponent implements OnInit {
    schoolDT: any = [];
    divisionDT: any = [];
    genderDT: any = [];

    ownersDT: any = [];
    ownerid: number = 0;
    ownername: string = "";

    studentname: string = "";
    gender: string = "";
    dob: any = "";
    schoolcode: string = "";
    division: string = "";
    aadharno: any = "";

    mothername: string = "";
    mothermobile: string = "";
    motheremail: string = "";
    fathername: string = "";
    fathermobile: string = "";
    fatheremail: string = "";

    resiaddr: string = "";
    pickupaddr: string = "";
    dropaddr: string = "";
    resilet: any = "";
    resilong: any = "";
    pickuplet: any = "";
    pickuplong: any = "";
    droplet: any = "";
    droplong: any = "";

    otherinfo: string = "";
    remark1: string = "";
    global = new Globals();

    config = {
        // Change this to your upload POST address:
        server: this.global.serviceurl + "uploads",
        method:"post",
        maxFilesize: 50,
        acceptedFiles: 'image/*'
    };

    constructor(private _studentervice: StudentService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.fillDropDownList();
    }

    public ngOnInit() {

    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }

    fillDropDownList() {
        var that = this;

        that._studentervice.getStudentDetail({ "flag": "dropdown" }).subscribe(data => {
            that.schoolDT = data.data.filter(a => a.group === "school");
            that.divisionDT = data.data.filter(a => a.group === "division");
            that.genderDT = data.data.filter(a => a.group === "gender");
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // AutoCompleted Users

    getAutoOwners(event) {
        let query = event.query;
        this._autoservice.getAutoData({
            "type": "owner",
            "search": query
        }).then(data => {
            this.ownersDT = data;
        });
    }

    // Selected Users

    selectAutoOwners(event) {
        this.ownerid = event.value;
        this.ownername = event.label;
    }

    saveStudentInfo() {
        var that = this;
        var studentprofiledata = [];

        studentprofiledata.push({
            "pickupaddr": that.pickupaddr, "dropaddr": that.dropaddr, "division": that.division, "gender": that.gender, "otherinfo": that.otherinfo
        })

        var saveStudent = {
            "studentcode": that.schoolcode,
            "studentname": that.studentname,
            "schoolcode": that.schoolcode,
            "name": that.mothername + ";" + that.fathername,
            "mobileno1": that.mothermobile,
            "mobileno2": that.fathermobile,
            "email1": that.motheremail,
            "email2": that.fatheremail,
            "address": that.resiaddr,
            "studentprofiledata": studentprofiledata,
            "resgeoloc": that.resilet + "," + that.resilong,
            "pickupgeoloc": that.pickuplet + "," + that.pickuplong,
            "pickdowngeoloc": that.droplet + "," + that.droplong,
            "aadharno": that.aadharno,
            "ownerid": that.ownerid,
            "uid": "vivek",
            "remark1": that.remark1
        }

        this._studentervice.saveStudentInfo(saveStudent).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_studentinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_studentinfo.msg;
                var parentid = dataResult[0].funsave_employee.keyid;

                alert(msg);
                // this._msg.Show(messageType.success, "Success", msg);
                this._router.navigate(['/employee/view']);
            }
            else {
                var msg = dataResult[0].funsave_studentinfo.msg;
                alert(msg);
                // this._msg.Show(messageType.error, "Error", msg);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }
}
