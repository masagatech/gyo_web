import { Component, OnInit } from '@angular/core';
import { PickDropService } from '../../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
// import { MessageService, messageType } from '../../../_services/messages/message-service'; /* add reference for master of master */
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
    ownerid: number = 0;
    ownername: string = "";

    studentsDT: any = [];
    counter: number = 0;

    pickstudentcode: string = "";
    pickstudentname: string = "";
    pickstudentmothername: string = "";
    pickstudentfathername: string = "";
    pickstudentmotheremail: string = "";
    pickstudentfatheremail: string = "";
    pickstudentmothermobile: string = "";
    pickstudentfathermobile: string = "";
    pickstudentgeoloc: string = "";

    dropstudentcode: string = "";
    dropstudentname: string = "";
    dropstudentmothername: string = "";
    dropstudentfathername: string = "";
    dropstudentmotheremail: string = "";
    dropstudentfatheremail: string = "";
    dropstudentmothermobile: string = "";
    dropstudentfathermobile: string = "";
    dropstudentgeoloc: string = "";

    pickStudentsDT: any = [];
    dropStudentsDT: any = [];

    schoolDT: any = [];
    batchDT: any = [];
    driverDT: any = [];
    vehicleDT: any = [];

    schoolid: number = 0;
    batchid: number = 0;
    pickautoid: number = 0;
    pickdriverid: number = 0;
    pickvehicleno: string = "";
    
    dropautoid: number = 0;
    dropdriverid: number = 0;
    dropvehicleno: string = "";

    instrunction: string = "";

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService,
        private _routeParams: ActivatedRoute, private _router: Router) {

    }

    public ngOnInit() {
        setTimeout(function () {
            $(".fa-angle-up").find('span').addClass('material-icons').text("save");
            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 0);
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
            "id": this.schoolid
        }).then(data => {
            this.studentsDT = data;
        });
    }

    // Selected Owners

    selectAutoData(event, type) {
        if (type === "owner") {
            this.ownerid = event.value;
            this.ownername = event.label;
            this.fillSchoolDropDown(this.ownerid);
            this.fillDriverDropDown(this.ownerid);
            this.fillVehicleDropDown(this.ownerid);
        }
        else {
            this.pickstudentcode = event.studcd;
            this.pickstudentname = event.studnm;
            this.pickstudentmothername = event.name.split(';')[0];
            this.pickstudentfathername = event.name.split(';')[1];
            this.pickstudentmotheremail = event.email1;
            this.pickstudentfatheremail = event.email2;
            this.pickstudentmothermobile = event.mobileno1;
            this.pickstudentfathermobile = event.mobileno2;
            this.pickstudentgeoloc = event.pickgeoloc;

            this.dropstudentcode = event.studcd;
            this.dropstudentname = event.studnm;
            this.dropstudentmothername = event.name.split(';')[0];
            this.dropstudentfathername = event.name.split(';')[1];
            this.dropstudentfatheremail = event.email1;
            this.dropstudentmotheremail = event.email2;
            this.dropstudentfathermobile = event.mobileno1;
            this.dropstudentmothermobile = event.mobileno2;
            this.dropstudentgeoloc = event.dropgeoloc;
        }
    }

    selectDropStudent(event) {
        this.dropstudentcode = event.studcd;
        this.dropstudentname = event.studnm;
        this.dropstudentmothername = event.name.split(';')[0];
        this.dropstudentfathername = event.name.split(';')[1];
        this.dropstudentfatheremail = event.email1;
        this.dropstudentmotheremail = event.email2;
        this.dropstudentfathermobile = event.mobileno1;
        this.dropstudentmothermobile = event.mobileno2;
        this.dropstudentgeoloc = event.dropgeoloc;
    }

    fillSchoolDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "school", "id": _ownerid }).subscribe(data => {
            that.schoolDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "batch", "id": that.schoolid }).subscribe(data => {
            that.batchDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillDriverDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "driver", "id": _ownerid }).subscribe(data => {
            that.driverDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillVehicleDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "vehicle", "id": _ownerid }).subscribe(data => {
            that.vehicleDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    setDropDriver() {
        this.dropdriverid = this.pickdriverid;
    }

    setDropVehicle() {
        this.dropvehicleno = this.pickvehicleno;
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
            "studentcode": that.pickstudentcode,
            "studentname": that.pickstudentname,
            "mothername": that.pickstudentmothername,
            "fathername": that.pickstudentfathername,
            "motheremail": that.pickstudentmotheremail,
            "fatheremail": that.pickstudentfatheremail,
            "mothermobile": that.pickstudentmothermobile,
            "fathermobile": that.pickstudentfathermobile,
            "pickgeoloc": that.pickstudentgeoloc,
            "dropgeoloc": that.dropstudentgeoloc
        });

        that.dropStudentsDT = that.reverseArr(that.pickStudentsDT);

        that.pickstudentcode = "";
        that.pickstudentname = "";
        that.pickstudentmothername = "";
        that.pickstudentfathername = "";
        that.pickstudentmotheremail = "";
        that.pickstudentfatheremail = "";
        that.pickstudentmothermobile = "";
        that.pickstudentfathermobile = "";
        that.pickstudentgeoloc = "";

        that.dropstudentcode = "";
        that.dropstudentname = "";
        that.dropstudentmothername = "";
        that.dropstudentfathername = "";
        that.dropstudentmotheremail = "";
        that.dropstudentfatheremail = "";
        that.dropstudentmothermobile = "";
        that.dropstudentfathermobile = "";
        that.dropstudentgeoloc = "";
    }

    dropStudents() {
        var that = this;

        that.dropStudentsDT.push({
            "counter": that.counter++,
            "studentcode": that.dropstudentcode,
            "studentname": that.dropstudentname,
            "mothername": that.dropstudentcode,
            "fathername": that.dropstudentname,
            "motheremail": that.dropstudentcode,
            "fatheremail": that.dropstudentname,
            "mothermobile": that.dropstudentcode,
            "fathermobile": that.dropstudentname,
            "dropgeoloc": that.dropstudentgeoloc
        });

        that.dropstudentcode = "";
        that.dropstudentname = "";
        that.dropstudentmothername = "";
        that.dropstudentfathername = "";
        that.dropstudentmotheremail = "";
        that.dropstudentfatheremail = "";
        that.dropstudentmothermobile = "";
        that.dropstudentfathermobile = "";
        that.dropstudentgeoloc = "";
    }

    deletePickUpStudents(row) {
        this.pickStudentsDT.splice(this.pickStudentsDT.indexOf(row), 1);
    }

    deleteDropStudents(row) {
        this.dropStudentsDT.splice(this.dropStudentsDT.indexOf(row), 1);
    }

    getPickDropInfo() {
        var that = this;

        this._pickdropservice.getPickDropDetail({
            "flag":"edit", "ownerid": that.ownerid, "schoolid": that.schoolid, "batchid": that.batchid
        }).subscribe(data => {
            try {
                var d = data.data;

                that.pickautoid = d.filter(a => a.typ === "p")[0].autoid;
                that.dropautoid = d.filter(a => a.typ === "d")[0].autoid;

                that.pickdriverid = d.filter(a => a.typ === "p")[0].driverid;
                that.dropdriverid = d.filter(a => a.typ === "d")[0].driverid;
                that.pickvehicleno = d.filter(a => a.typ === "p")[0].vehicleno;
                that.dropvehicleno = d.filter(a => a.typ === "d")[0].vehicleno;
                
                that.pickStudentsDT = d.filter(a => a.typ === "p")[0].studentdata;
                that.dropStudentsDT = d.filter(a => a.typ === "d")[0].studentdata;
            }
            catch (e) {
                alert(e);
            }
        }, err => {
            alert(err);
            // that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        });
    }

    savePickDropInfo() {
        var that = this;
        var _pickdrop = [];
        var _pickstudDT = [];
        var _dropstudDT = [];

        var savepickdrop = {};

        for (var i = 0; i < that.pickStudentsDT.length; i++) {
            _pickstudDT.push({
                "studentcode": that.pickStudentsDT[i].studentcode, "studentname": that.pickStudentsDT[i].studentname,
                "mothername": that.pickStudentsDT[i].mothername, "fathername": that.pickStudentsDT[i].fathername,
                "motheremail": that.pickStudentsDT[i].motheremail, "fatheremail": that.pickStudentsDT[i].fatheremail,
                "mothermobile": that.pickStudentsDT[i].mothermobile, "fathermobile": that.pickStudentsDT[i].fathermobile,
                "pickgeoloc": that.pickStudentsDT[i].pickgeoloc
            })
        }

        for (var j = 0; j < that.dropStudentsDT.length; j++) {
            _dropstudDT.push({
                "studentcode": that.dropStudentsDT[j].studentcode, "studentname": that.dropStudentsDT[j].studentname,
                "mothername": that.dropStudentsDT[j].mothername, "fathername": that.dropStudentsDT[j].fathername,
                "motheremail": that.dropStudentsDT[j].motheremail, "fatheremail": that.dropStudentsDT[j].fatheremail,
                "mothermobile": that.dropStudentsDT[j].mothermobile, "fathermobile": that.dropStudentsDT[j].fathermobile,
                "dropgeoloc": that.dropStudentsDT[j].dropgeoloc
            })
        }

        _pickdrop.push({
            "autoid": that.pickautoid,
            "ownid": that.ownerid,
            "schid": that.schoolid,
            "schnm": that.schoolid,
            "btchid": that.batchid,
            "drvid": that.pickdriverid,
            "vhclno": that.pickvehicleno,
            "studdt": _pickstudDT,
            "uid": "vivek",
            "inst": that.instrunction,
            "typ": "p"
        });

        _pickdrop.push({
            "autoid": that.dropautoid,
            "ownid": that.ownerid,
            "schid": that.schoolid,
            "schnm": that.schoolid,
            "btchid": that.batchid,
            "drvid": that.dropdriverid == 0 ? that.pickdriverid : that.dropdriverid,
            "vhclno": that.dropvehicleno,
            "studdt": _dropstudDT,
            "uid": "vivek",
            "inst": that.instrunction,
            "typ": "d"
        });

        savepickdrop = { "pickdropdata": _pickdrop };

        this._pickdropservice.savePickDropInfo(savepickdrop).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_pickdropinfo.msgid != "-1") {
                    // that._msg.Show(messageType.success, "Success", dataResult[0].funsave_pickdropinfo.msg);
                    alert(dataResult[0].funsave_pickdropinfo.msg);
                    that._router.navigate(['/pickdrop']);
                }
                else {
                    alert(dataResult[0].funsave_pickdropinfo.msg);
                    // that._msg.Show(messageType.error, "Error", dataResult[0].funsave_pickdropinfo.msg);
                }
            }
            catch (e) {
                alert(e);
            }
        }, err => {
            alert(err);
            // that._msg.Show(messageType.error, "Error", err);
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
