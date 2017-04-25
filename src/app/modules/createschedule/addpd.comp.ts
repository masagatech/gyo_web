import { Component, OnInit } from '@angular/core';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
// import { MessageService, messageType } from '../../_services/messages/message-service'; /* add reference for master of master */
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'addpd.comp.html',
    providers: [PickDropService, CommonService]
})

export class CreateScheduleComponent implements OnInit {
    ownersDT: any = [];
    ownerid: number = 0;
    ownername: string = "";

    studentsDT: any = [];
    counter: number = 0;

    pickstudentid: number = 0;
    pickstudentname: string = "";
    pickstudentmothername: string = "";
    pickstudentfathername: string = "";
    pickstudentmotheremail: string = "";
    pickstudentfatheremail: string = "";
    pickstudentmothermobile: string = "";
    pickstudentfathermobile: string = "";
    pickstudentgeoloc: string = "";

    dropstudentid: number = 0;
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

    private pickfromdate: any = "";
    private picktodate: any = "";
    private dropfromdate: any = "";
    private droptodate: any = "";

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService,
        private _routeParams: ActivatedRoute, private _router: Router) {

    }

    public ngOnInit() {
        this.getPDDate();

        setTimeout(function () {
            $(".fa-angle-up").find('span').addClass('material-icons').text("save");
            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getPDDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.pickfromdate = this.formatDate(today);
        this.picktodate = this.formatDate(today.setFullYear(2018));
        this.dropfromdate = this.formatDate(today);
        this.droptodate = this.formatDate(today.setFullYear(2018));
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
            this.pickstudentid = event.studid;
            this.pickstudentname = event.studnm;
            this.pickstudentmothername = event.name.split(';')[0];
            this.pickstudentfathername = event.name.split(';')[1];
            this.pickstudentmotheremail = event.email1;
            this.pickstudentfatheremail = event.email2;
            this.pickstudentmothermobile = event.mobileno1;
            this.pickstudentfathermobile = event.mobileno2;
            this.pickstudentgeoloc = event.pickgeoloc;

            this.dropstudentid = event.studid;
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
        this.dropstudentid = event.studid;
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

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "school", "id": _ownerid }).subscribe(data => {
            that.schoolDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "batch", "id": that.schoolid }).subscribe(data => {
            that.batchDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillDriverDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "driver", "id": _ownerid }).subscribe(data => {
            that.driverDT = data.data;
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillVehicleDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "vehicle", "id": _ownerid }).subscribe(data => {
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
        var p_latlon = that.pickstudentgeoloc.split(',');
        
        that.pickStudentsDT.push({
            "counter": that.counter++,
            "stdid": that.pickstudentid,
            "stdnm": that.pickstudentname,
            "mthrnm": that.pickstudentmothername,
            "fthrnm": that.pickstudentfathername,
            "mthreml": that.pickstudentmotheremail,
            "fthreml": that.pickstudentfatheremail,
            "mthrmob": that.pickstudentmothermobile,
            "fthrmob": that.pickstudentfathermobile,
            "late": (p_latlon.length > 0 ? p_latlon[0] : 0),
            "long": (p_latlon.length > 0 ? p_latlon[1] : 0)
        });

        that.dropStudentsDT = that.reverseArr(that.pickStudentsDT);

        that.pickstudentid = 0;
        that.pickstudentname = "";
        that.pickstudentmothername = "";
        that.pickstudentfathername = "";
        that.pickstudentmotheremail = "";
        that.pickstudentfatheremail = "";
        that.pickstudentmothermobile = "";
        that.pickstudentfathermobile = "";
        that.pickstudentgeoloc = "";

        that.dropstudentid = 0;
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
        var d_latlon = that.dropstudentgeoloc.split(',');

        that.dropStudentsDT.push({
            "counter": that.counter++,
            "stdid": that.dropstudentid,
            "stdnm": that.dropstudentname,
            "mthrnm": that.dropstudentmothername,
            "fthrnm": that.dropstudentfathername,
            "mthreml": that.dropstudentmotheremail,
            "fthreml": that.dropstudentfatheremail,
            "mthrmob": that.dropstudentmothermobile,
            "fthrmob": that.dropstudentfathermobile,
            "late": (d_latlon.length > 0 ? d_latlon[0] : 0),
            "long": (d_latlon.length > 0 ? d_latlon[1] : 0)
        });

        that.dropstudentid = 0;
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
        commonfun.loader();
        var that = this;

        this._pickdropservice.getPickDropDetails({
            "flag": "edit", "ownerid": that.ownerid, "schoolid": that.schoolid, "batchid": that.batchid
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
                commonfun.loaderhide();
            }
            catch (e) {
                alert(e);
                commonfun.loaderhide();
            }
        }, err => {
            alert(err);
            // that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    savePickDropInfo() {
        commonfun.loader();
        var that = this;
        var _pickdrop = [];
        var _pickstudDT = [];
        var _dropstudDT = [];

        var savepickdrop = {};

        for (var i = 0; i < that.pickStudentsDT.length; i++) {
            _pickstudDT.push({
                "stdid": that.pickStudentsDT[i].stdid,
                "stdnm": that.pickStudentsDT[i].stdnm,
                "mthrnm": that.pickStudentsDT[i].mthrnm,
                "fthrnm": that.pickStudentsDT[i].fthrnm,
                "mthreml": that.pickStudentsDT[i].mthreml,
                "fthreml": that.pickStudentsDT[i].fthreml,
                "mthrmob": that.pickStudentsDT[i].mthrmob,
                "fthrmob": that.pickStudentsDT[i].fthrmob,
                "lat": that.pickStudentsDT[i].lat,
                "lon": that.pickStudentsDT[i].lon
            });
        }

        for (var i = 0; i < that.dropStudentsDT.length; i++) {
            _dropstudDT.push({
                "stdid": that.dropStudentsDT[i].stdid,
                "stdnm": that.dropStudentsDT[i].stdnm,
                "mthrnm": that.dropStudentsDT[i].mthrnm,
                "fthrnm": that.dropStudentsDT[i].fthrnm,
                "mthreml": that.dropStudentsDT[i].mthreml,
                "fthreml": that.dropStudentsDT[i].fthreml,
                "mthrmob": that.dropStudentsDT[i].mthrmob,
                "fthrmob": that.dropStudentsDT[i].fthrmob,
                "lat": that.dropStudentsDT[i].lat,
                "lon": that.dropStudentsDT[i].lon
            });
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
            "frmdt": that.pickfromdate,
            "todt": that.picktodate,
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
            "frmdt": that.dropfromdate,
            "todt": that.droptodate,
            "typ": "d"
        });

        savepickdrop = { "pickdropdata": _pickdrop };

        this._pickdropservice.savePickDropInfo(savepickdrop).subscribe((data) => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_pickdropinfo.msgid != "-1") {
                    // that._msg.Show(messageType.success, "Success", dataResult[0].funsave_pickdropinfo.msg);
                    alert(dataResult[0].funsave_pickdropinfo.msg);
                    that._router.navigate(['/createschedule']);
                }
                else {
                    alert(dataResult[0].funsave_pickdropinfo.msg);
                    // that._msg.Show(messageType.error, "Error", dataResult[0].funsave_pickdropinfo.msg);
                }
                commonfun.loaderhide();
            }
            catch (e) {
                alert(e);
                commonfun.loaderhide();
            }
        }, err => {
            alert(err);
            // that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide();
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
