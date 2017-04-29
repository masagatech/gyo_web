import { Component, OnInit, ViewChild } from '@angular/core';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../_services/messages/message-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'viewpd.comp.html',
    providers: [PickDropService, CommonService]
})

export class ChangeScheduleComponent implements OnInit {
    private ownersDT: any = [];
    private ownerid: number = 0;
    private ownername: string = "";

    private studentsDT: any = [];
    private counter: number = 0;

    private events: any[];
    private header: any;
    private event: MyEvent;
    private defaultDate: string = "";

    private p_stdid: number = 0;
    private pickstudentname: string = "";
    private pickaddr: string = "";
    private pickstudentmothername: string = "";
    private pickstudentfathername: string = "";
    private pickstudentmotheremail: string = "";
    private pickstudentfatheremail: string = "";
    private pickstudentmothermobile: string = "";
    private pickstudentfathermobile: string = "";
    private pickstudentgeoloc: string = "";

    private dropstudentid: number = 0;
    private dropstudentname: string = "";
    private dropaddr: string = "";
    private dropstudentmothername: string = "";
    private dropstudentfathername: string = "";
    private dropstudentmotheremail: string = "";
    private dropstudentfatheremail: string = "";
    private dropstudentmothermobile: string = "";
    private dropstudentfathermobile: string = "";
    private dropstudentgeoloc: string = "";

    private pickStudentsDT: any = [];
    private dropStudentsDT: any = [];

    private schoolDT: any = [];
    private batchDT: any = [];
    private driverDT: any = [];
    private vehicleDT: any = [];

    private schoolid: number = 0;
    private batchid: number = 0;
    private pickautoid: number = 0;
    private pickdriverid: number = 0;
    private pickvehicleno: string = "";

    private dropautoid: number = 0;
    private dropdriverid: number = 0;
    private dropvehicleno: string = "";

    private instrunction: string = "";

    private pickfromdate: any = "";
    private picktodate: any = "";
    private dropfromdate: any = "";
    private droptodate: any = "";

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService) {
        this.getDefaultDate();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();

            commonfun.chevronstyle();
        }, 0);

        that.header = {
            left: 'prev,next',
            center: 'title',
            // right: 'month,agendaWeek,agendaDay'
            right: 'today'
        };
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getDefaultDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.defaultDate = this.formatDate(today);
    }

    // Auto Completed Owners

    getOwnerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "type": "owner",
            "search": query
        }).then((data) => {
            this.ownersDT = data;
        });
    }

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "type": "student",
            "search": query,
            "id": this.schoolid
        }).then((data) => {
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
            this.p_stdid = event.studid;
            this.pickstudentname = event.studnm;
            this.pickaddr = event.pickupaddr;
            this.pickstudentmothername = event.name.split(';')[0];
            this.pickstudentfathername = event.name.split(';')[1];
            this.pickstudentmotheremail = event.email1;
            this.pickstudentfatheremail = event.email2;
            this.pickstudentmothermobile = event.mobileno1;
            this.pickstudentfathermobile = event.mobileno2;
            this.pickstudentgeoloc = event.pickgeoloc;

            this.dropstudentid = event.studid;
            this.dropstudentname = event.studnm;
            this.dropaddr = event.dropaddr;
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
        this.dropstudentid = event.studcd;
        this.dropstudentname = event.studnm;
        this.dropaddr = event.dropaddr;
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

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "school", "id": _ownerid }).subscribe((data) => {
            try {
                that.schoolDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillBatchDropDown() {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "batch", "id": that.schoolid }).subscribe((data) => {
            try {
                that.batchDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillDriverDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "driver", "id": _ownerid }).subscribe((data) => {
            try {
                that.driverDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    fillVehicleDropDown(_ownerid) {
        var that = this;

        that._pickdropservice.getPickDropDetails({ "flag": "dropdown", "group": "vehicle", "id": _ownerid }).subscribe((data) => {
            try {
                that.vehicleDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
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
            "stdid": that.p_stdid,
            "stdnm": that.pickstudentname,
            "addr": that.pickaddr,
            "mthrnm": that.pickstudentmothername,
            "fthrnm": that.pickstudentfathername,
            "mthreml": that.pickstudentmotheremail,
            "fthreml": that.pickstudentfatheremail,
            "mthrmob": that.pickstudentmothermobile,
            "fthrmob": that.pickstudentfathermobile,
            "lat": (p_latlon.length > 0 ? p_latlon[0] : 0),
            "lon": (p_latlon.length > 0 ? p_latlon[1] : 0)
        });

        that.dropStudentsDT = that.reverseArr(that.pickStudentsDT);

        that.p_stdid = 0;
        that.pickstudentname = "";
        that.pickaddr = "";
        that.pickstudentmothername = "";
        that.pickstudentfathername = "";
        that.pickstudentmotheremail = "";
        that.pickstudentfatheremail = "";
        that.pickstudentmothermobile = "";
        that.pickstudentfathermobile = "";
        that.pickstudentgeoloc = "";

        that.dropstudentid = 0;
        that.dropstudentname = "";
        that.dropaddr = "";
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
            "addr": that.dropaddr,
            "mthrnm": that.dropstudentmothername,
            "fthrnm": that.dropstudentfathername,
            "mthreml": that.dropstudentmotheremail,
            "fthreml": that.dropstudentfatheremail,
            "mthrmob": that.dropstudentmothermobile,
            "fthrmob": that.dropstudentfathermobile,
            "lat": (d_latlon.length > 0 ? d_latlon[0] : 0),
            "lon": (d_latlon.length > 0 ? d_latlon[1] : 0)
        });

        that.dropstudentid = 0;
        that.dropstudentname = "";
        that.dropaddr = "";
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

    // Selected Calendar Date

    getPDDate(event) {
        this.pickfromdate = this.formatDate(event.date);
        this.picktodate = this.formatDate(event.date);
        this.dropfromdate = this.formatDate(event.date);
        this.droptodate = this.formatDate(event.date);
    }

    getPickDropInfo(event) {
        commonfun.loader();
        var that = this;

        this._pickdropservice.getPickDropDetails({
            "flag": "edit", "ownerid": that.ownerid, "schoolid": that.schoolid, "batchid": that.batchid,
            "frmdt": event.date, "todt": event.date
        }).subscribe((data) => {
            try {
                var d = data.data;

                if (d.length !== 0) {
                    var pickdata = d.filter(a => a.typ === "p")[0];
                    var dropdata = d.filter(a => a.typ === "d")[0];

                    that.pickautoid = pickdata.autoid;
                    that.pickdriverid = pickdata.driverid;
                    that.pickvehicleno = pickdata.vehicleno;
                    that.pickStudentsDT = pickdata.studentdata;
                    that.pickfromdate = pickdata.frmdt;
                    that.picktodate = pickdata.todt;

                    that.dropautoid = dropdata.autoid;
                    that.dropdriverid = dropdata.driverid;
                    that.dropvehicleno = dropdata.vehicleno;
                    that.dropStudentsDT = dropdata.studentdata;
                    that.dropfromdate = dropdata.frmdt;
                    that.droptodate = dropdata.todt;

                    commonfun.loaderhide();
                }
                else {
                    that.pickautoid = 0;
                    that.pickdriverid = 0;
                    that.pickvehicleno = "";
                    that.pickStudentsDT = [];

                    that.dropautoid = 0;
                    that.dropdriverid = 0;
                    that.dropvehicleno = "";
                    that.dropStudentsDT = [];

                    that.getPDDate(event);
                    commonfun.loaderhide();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
                commonfun.loaderhide();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
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

        var _pickstudsid: string[] = [];
        var _dropstudsid: string[] = [];

        var savepickdrop = {};

        for (var i = 0; i < that.pickStudentsDT.length; i++) {
            _pickstudDT.push({
                "stdid": that.pickStudentsDT[i].stdid,
                "stdnm": that.pickStudentsDT[i].stdnm,
                "addr": that.pickStudentsDT[i].addr,
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
                "addr": that.dropStudentsDT[i].addr,
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

        _pickstudsid = Object.keys(_pickstudDT).map(function (k) { return _pickstudDT[k].stdid });
        _dropstudsid = Object.keys(_dropstudDT).map(function (k) { return _dropstudDT[k].stdid });

        _pickdrop.push({
            "autoid": that.pickautoid,
            "ownid": that.ownerid,
            "schid": that.schoolid,
            "schnm": that.schoolid,
            "btchid": that.batchid,
            "drvid": that.pickdriverid,
            "vhclno": that.pickvehicleno,
            "studdt": _pickstudDT,
            "studsid": _pickstudsid,
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
            "studsid": _dropstudsid,
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
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_pickdropinfo.msg);
                    that._router.navigate(['/changeschedule']);
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_pickdropinfo.msg);
                }

                commonfun.loaderhide();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
                commonfun.loaderhide();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
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

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}