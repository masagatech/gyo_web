import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../_services/student/student-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../_const/globals';
import { LazyLoadEvent } from 'primeng/primeng';

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

    studentid: number = 0;
    studentcode: string = "";
    studentname: string = "";
    gender: string = "";
    dob: any = "";
    schoolid: number = 0;
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

    private subscribeParameters: any;

    config = {
        // Change this to your upload POST address:
        server: this.global.serviceurl + "uploads",
        method: "post",
        maxFilesize: 50,
        acceptedFiles: 'image/*'
    };

    constructor(private _studentervice: StudentService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.studentid = params['id'];
                this.getStudentDetails(this.studentid);
            }
        });
    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._studentervice.getStudentDetails({ "flag": "dropdown" }).subscribe(data => {
            that.schoolDT = data.data.filter(a => a.group === "school");
            that.divisionDT = data.data.filter(a => a.group === "division");
            that.genderDT = data.data.filter(a => a.group === "gender");

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);

            commonfun.loaderhide();
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
        commonfun.loader();
        var studentprofiledata = [];

        studentprofiledata.push({
            "pickupaddr": that.pickupaddr, "dropaddr": that.dropaddr, "division": that.division, "gender": that.gender, "otherinfo": that.otherinfo
        })

        var saveStudent = {
            "studentcode": that.schoolid,
            "studentname": that.studentname,
            "schoolid": that.schoolid,
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

            commonfun.loaderhide();
        }, err => {
            console.log(err);

            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get student Data

    getStudentDetails(sid) {
        var that = this;
        commonfun.loader();

        that._studentervice.getStudentDetails({ "flag": "edit", "id": sid }).subscribe(data => {
            that.studentid = data.data[0].autoid;
            that.studentcode = data.data[0].studentcode;
            that.studentname = data.data[0].studentname;
            that.gender = data.data[0].studentprofiledata.gender;
            that.dob = data.data[0].studentprofiledata.dob;
            that.ownerid = data.data[0].ownerid;
            that.ownername = data.data[0].ownername;
            that.schoolid = data.data[0].schoolid;
            that.division = data.data[0].studentprofiledata.division;
            that.aadharno = data.data[0].aadharno;
            that.mothername = data.data[0].name.split(';')[0];
            that.mothermobile = data.data[0].mobileno1;
            that.motheremail = data.data[0].email1;
            that.fathername = data.data[0].name.split(';')[1];
            that.fathermobile = data.data[0].mobileno2;
            that.fatheremail = data.data[0].email2;
            that.resiaddr = data.data[0].address;
            that.pickupaddr = data.data[0].studentprofiledata.pickupaddr;
            that.dropaddr = data.data[0].studentprofiledata.dropaddr;
            that.resilet = data.data[0].resgeoloc.split(',')[0];
            that.resilong = data.data[0].resgeoloc.split(',')[1];
            that.pickuplet = data.data[0].pickgeoloc.split(',')[0];
            that.pickuplong = data.data[0].pickgeoloc.split(',')[1];
            that.droplet = data.data[0].dropgeoloc.split(',')[0];
            that.droplong = data.data[0].dropgeoloc.split(',')[1];
            that.otherinfo = data.data[0].studentprofiledata.otherinfo;
            that.remark1 = data.data[0].remark1;

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/student']);
    }
}
