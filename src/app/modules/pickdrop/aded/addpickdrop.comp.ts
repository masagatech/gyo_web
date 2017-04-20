import { Component, OnInit } from '@angular/core';
import { PickDropService } from '../../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;
declare var Dropzone: any;
@Component({
    templateUrl: 'addpickdrop.comp.html',
    providers: [PickDropService, CommonService]
})

export class AddPickDropComponent implements OnInit {
    ownersDT: any = [];
    ownercode: string = "";
    ownername: string = "";

    studentsDT: any = [];
    counter: number = 0;
    studentcode: string = "";
    studentname: string = "";

    pickStudentsDT: any = [];
    dropStudentsDT: any = [];

    schoolDT: any = [];
    batchDT: any = [];
    driverDT: any = [];
    vehicleDT: any = [];

    schoolcode: string = "";
    batchcode: string = "";
    drivercode: string = "";
    vehiclecode: string = "";

    instrunction: string = "";

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _router: Router) {

    }

    public ngOnInit() {
        // setTimeout(function () {
        //     $(".ui-button-icon-only").find('span').removeAttr('class').addClass('demo-google-material-icon');
        // }, 0);
    }

    // Auto Completed Owners

    getOwnerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "type": "owner",
            "search": query
        }).then(data => {
            this.ownersDT = data;
        });
    }

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "type": "student",
            "search": query,
            "code": this.schoolcode
        }).then(data => {
            this.studentsDT = data;
        });
    }

    // Selected Owners

    selectAutoData(event, type) {
        if (type === "owner") {
            this.ownercode = event.value;
            this.ownername = event.label;
            this.fillSchoolDropDown(this.ownercode);
            this.fillDriverDropDown(this.ownercode);
            this.fillVehicleDropDown(this.ownercode);
        }
        else {
            this.studentcode = event.value;
            this.studentname = event.label;
        }
    }

    fillSchoolDropDown(_ownercode) {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "school", "code": _ownercode }).subscribe(data => {
            that.schoolDT = data.data;
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "batch", "code": that.schoolcode }).subscribe(data => {
            that.batchDT = data.data;
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillDriverDropDown(_ownercode) {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "driver", "code": _ownercode }).subscribe(data => {
            that.driverDT = data.data;
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillVehicleDropDown(_ownercode) {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "vehicle", "code": _ownercode }).subscribe(data => {
            that.vehicleDT = data.data;
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    reverseArr(input) {
        var ret = new Array;
        for (var i = input.length - 1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
    }


    pickupStudents() {
        var that = this;

        that.pickStudentsDT.push({
            "counter": that.counter++,
            "studentcode": that.studentcode,
            "studentname": that.studentname
        });

        that.dropStudentsDT = that.reverseArr(that.pickStudentsDT);

        that.studentcode = "";
        that.studentname = "";
    }

    savePickDropInfo() {
        var that = this;

        var savepickdrop = {
            "ownercode": that.ownercode,
            "schoolcode": that.schoolcode,
            "batchcode": that.batchcode,
            "drivercode": that.drivercode,
            "vehiclecode": that.vehiclecode,
            "studentcode": that.studentcode,
            "studentname": that.studentname,
            "uid": "vivek",
            "instrunction": that.instrunction
        }

        this._pickdropservice.savePickDropInfo(savepickdrop).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_pickdropinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_pickdropinfo.msg;
                var parentid = dataResult[0].funsave_pickdropinfo.keyid;

                alert(msg);
                // this._msg.Show(messageType.success, "Success", msg);
                this._router.navigate(['/employee/view']);
            }
            else {
                var msg = dataResult[0].funsave_pickdropinfo.msg;
                alert(msg);
                // this._msg.Show(messageType.error, "Error", msg);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }
}
