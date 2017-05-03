import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../_services/student/student-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
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

    isCopyPickupAddr: boolean = false;
    isCopyDropAddr: boolean = false;

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

    constructor(private _studentervice: StudentService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        $(".ownername input").focus();
        this.getStudentDetails();
    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }

    // AutoCompleted Users

    getAutoOwners(event) {
        let query = event.query;
        this._autoservice.getAutoData({
            "flag": "owner",
            "typ": "Co-ordinator",
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

    // Fill School, Division, Gender DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._studentervice.getStudentDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.schoolDT = data.data.filter(a => a.group === "school");
                that.divisionDT = data.data.filter(a => a.group === "division");
                that.genderDT = data.data.filter(a => a.group === "gender");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);

            commonfun.loaderhide();
        }, () => {

        })
    }

    // Copy Pick Up and Drop Address and Lat Lon from Residental Address and Lat Long

    copyPDAddrAndLatLong() {
        if (this.isCopyPickupAddr) {
            this.pickupaddr = this.resiaddr;
            this.pickuplet = this.resilet;
            this.pickuplong = this.resilong;
        }
        else {
            this.pickupaddr = "";
            this.pickuplet = "";
            this.pickuplong = "";
        }

        if (this.isCopyDropAddr) {
            this.dropaddr = this.resiaddr;
            this.droplet = this.resilet;
            this.droplong = this.resilong;
        }
        else {
            this.dropaddr = "";
            this.droplet = "";
            this.droplong = "";
        }
    }

    saveStudentInfo() {
        var that = this;

        if (that.ownerid === 0) {
            that._msg.Show(messageType.error, "Error", "Please Enter Owner Name");
            $(".ownername input").focus();
        }
        else if (that.schoolid === 0) {
            that._msg.Show(messageType.error, "Error", "Please Select School Name");
        }
        else if (that.studentname === "") {
            that._msg.Show(messageType.error, "Error", "Please Enter Student Name");
        }
        else if (that.division === "") {
            that._msg.Show(messageType.error, "Error", "Please Enter Division");
        }
        else if (that.gender === "") {
            that._msg.Show(messageType.error, "Error", "Please Enter Gender");
        }
        else if (that.dob === "") {
            that._msg.Show(messageType.error, "Error", "Please Enter Date Of Birth");
        }
        else if (that.aadharno === "") {
            that._msg.Show(messageType.error, "Error", "Please Enter Aadhar No");
        }
        else {
            commonfun.loader();

            var studentprofiledata = {};

            studentprofiledata = {
                "gender": that.gender, "dob": that.dob, "division": that.division,
                "pickupaddr": that.pickupaddr, "dropaddr": that.dropaddr, "otherinfo": that.otherinfo
            }

            var saveStudent = {
                "autoid": that.studentid,
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

            that._studentervice.saveStudentInfo(saveStudent).subscribe(data => {
                try {
                    var dataResult = data.data;

                    if (dataResult[0].funsave_studentinfo.msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", dataResult[0].funsave_studentinfo.msg);
                        that._router.navigate(['/student']);
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", dataResult[0].funsave_studentinfo.msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide();
            }, err => {
                console.log(err);
                that._msg.Show(messageType.error, "Error", err);

                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get student Data

    getStudentDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.studentid = params['id'];

                that._studentervice.getStudentDetails({ "flag": "edit", "id": that.studentid }).subscribe(data => {
                    try {
                        that.studentid = data.data[0].autoid;
                        that.studentcode = data.data[0].studentcode;
                        that.studentname = data.data[0].studentname;

                        that.ownerid = data.data[0].ownerid;
                        that.ownername = data.data[0].ownername;
                        that.schoolid = data.data[0].schoolid;
                        that.aadharno = data.data[0].aadharno;
                        that.mothername = data.data[0].name.split(';')[0];
                        that.mothermobile = data.data[0].mobileno1;
                        that.motheremail = data.data[0].email1;
                        that.fathername = data.data[0].name.split(';')[1];
                        that.fathermobile = data.data[0].mobileno2;
                        that.fatheremail = data.data[0].email2;
                        that.resiaddr = data.data[0].address;
                        that.resilet = data.data[0].resilat;
                        that.resilong = data.data[0].resilon;
                        that.pickuplet = data.data[0].pickuplat;
                        that.pickuplong = data.data[0].pickuplon;
                        that.droplet = data.data[0].droplat;
                        that.droplong = data.data[0].droplon;
                        that.remark1 = data.data[0].remark1;

                        var studentprofiledata = data.data[0].studentprofiledata;

                        if (studentprofiledata !== null) {
                            that.gender = data.data[0].gender;
                            that.dob = data.data[0].dob;
                            that.division = data.data[0].division;
                            that.pickupaddr = data.data[0].pickupaddr;
                            that.dropaddr = data.data[0].dropaddr;
                            that.otherinfo = data.data[0].otherinfo;
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                    commonfun.loaderhide();
                }, () => {

                })
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/student']);
    }
}
