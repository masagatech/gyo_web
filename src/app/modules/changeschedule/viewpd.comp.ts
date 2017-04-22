import { Component, OnInit, ViewChild } from '@angular/core';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
// import { MessageService, messageType } from '../../_services/messages/message-service'; /* add reference for master of master */
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
declare var Dropzone: any;
declare var commonfun: any;

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

    private pickstudentcode: string = "";
    private pickstudentname: string = "";
    private pickstudentmothername: string = "";
    private pickstudentfathername: string = "";
    private pickstudentmotheremail: string = "";
    private pickstudentfatheremail: string = "";
    private pickstudentmothermobile: string = "";
    private pickstudentfathermobile: string = "";
    private pickstudentgeoloc: string = "";

    private dropstudentcode: string = "";
    private dropstudentname: string = "";
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

    constructor(private _pickdropservice: PickDropService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.getDefaultDate();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            // ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only
            // ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only

            // $(".ui-button-icon-left").find('span').addClass('material-icons').text("save");
            // ui-button-icon-left ui-c fa fa-fw fa-angle-up

            var arrbtn = $(".ui-button-icon-only");
            var ids = 0;

            for (var i = 1; i <= $(".ui-button-icon-only").length; i++) {
                $(".ui-button-icon-only").attr('id', 'btn' + i);
            }


            console.log(".ui-button-icon-only" + $(".ui-button-icon-only").length);

            // $(".ui-button-icon-only").find('span').removeAttr('class').addClass('material-icons').text("keyboard_arrow_down");
            $(".ui-picklist-buttons").hide();
            $(".ui-picklist-source-controls").show();
            $(".ui-picklist-target-controls").show();

            $(".fc-prev-button").find('span').removeAttr('class').addClass('material-icons');
            $(".fc-next-button").find('span').removeAttr('class').addClass('material-icons');
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
        commonfun.loader();
        let query = event.query;

        this._autoservice.getAutoData({
            "type": "student",
            "search": query,
            "id": this.schoolid
        }).then((data) => {
            this.studentsDT = data;
            commonfun.loaderhide();
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
        commonfun.loader();
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "school", "id": _ownerid }).subscribe((data) => {
            that.schoolDT = data.data;
            commonfun.loaderhide();
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    fillBatchDropDown() {
        commonfun.loader();
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "batch", "id": that.schoolid }).subscribe((data) => {
            that.batchDT = data.data;
            commonfun.loaderhide();
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    fillDriverDropDown(_ownerid) {
        commonfun.loader();
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "driver", "id": _ownerid }).subscribe((data) => {
            that.driverDT = data.data;
            commonfun.loaderhide();
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    fillVehicleDropDown(_ownerid) {
        commonfun.loader();
        var that = this;

        that._pickdropservice.getPickDropDetail({ "flag": "dropdown", "group": "vehicle", "id": _ownerid }).subscribe((data) => {
            that.vehicleDT = data.data;
            commonfun.loaderhide();
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
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

        this._pickdropservice.getPickDropDetail({
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
                    that.dropautoid = 0;

                    that.pickdriverid = 0;
                    that.dropdriverid = 0;

                    that.pickvehicleno = "";
                    that.dropvehicleno = "";

                    that.pickStudentsDT = [];
                    that.dropStudentsDT = [];

                    that.getPDDate(event);
                    commonfun.loaderhide();
                }
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
                    that._router.navigate(['/pickdrop']);
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

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}