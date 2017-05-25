import { Component, OnInit } from '@angular/core';
import { PassengerService } from '../../../_services/passenger/psngr-service';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../_const/globals';

declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addpsngr.comp.html',
    providers: [PassengerService, CommonService]
})

export class AddPassengerComponent implements OnInit {
    loginUser: LoginUserModel;

    schoolDT: any = [];
    divisionDT: any = [];
    genderDT: any = [];

    ownersDT: any = [];
    ownerid: number = 0;
    ownername: string = "";

    psngrid: number = 0;
    psngrcode: string = "";
    psngrname: string = "";
    gender: string = "";
    dob: any = "";
    enttid: number = 0;
    division: string = "";
    aadharno: any = "";

    mothername: string = "";
    secondarymobile: string = "";
    secondaryemail: string = "";
    fathername: string = "";
    primarymobile: string = "";
    primaryemail: string = "";

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

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    config = {
        // Change this to your upload POST address:
        server: this.global.serviceurl + "uploads",
        method: "post",
        maxFilesize: 50,
        acceptedFiles: 'image/*'
    };

    constructor(private _psngrservice: PassengerService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        $(".ownername input").focus();
        this.getPassengerDetails();
    }

    public ngAfterViewInit() {

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
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": "coord",
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

        that._psngrservice.getPassengerDetails({ "flag": "dropdown" }).subscribe(data => {
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

    // Clear Fields

    resetPassengerFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Active / Deactive Data

    active_deactivePassengerInfo() {
        var that = this;

        var act_deactHoliday = {
            "autoid": that.ownerid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        that._psngrservice.savePassengerInfo(act_deactHoliday).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_Passengerinfo.msg;
                var msgid = dataResult[0].funsave_Passengerinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getPassengerDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Save Data

    savePassengerInfo() {
        var that = this;

        if (that.ownerid === 0) {
            that._msg.Show(messageType.error, "Error", "Enter Owner Name");
            $(".ownername input").focus();
        }
        else if (that.enttid === 0) {
            that._msg.Show(messageType.error, "Error", "Select School Name");
        }
        else if (that.psngrname === "") {
            that._msg.Show(messageType.error, "Error", "Enter Passenger Name");
        }
        else if (that.division === "") {
            that._msg.Show(messageType.error, "Error", "Enter Division");
        }
        else if (that.primaryemail === "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Email");
        }
        else if (that.primarymobile === "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Mobile");
        }
        else if (that.resiaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Address");
        }
        else if (that.resilet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Lat");
        }
        else if (that.resilong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Long");
        }
        else if (that.pickupaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Address");
        }
        else if (that.pickuplet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Lat");
        }
        else if (that.pickuplong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Pick Up Long");
        }
        else if (that.dropaddr === "") {
            that._msg.Show(messageType.error, "Error", "Enter Drop Address");
        }
        else if (that.droplet === "") {
            that._msg.Show(messageType.error, "Error", "Enter Drop Lat");
        }
        else if (that.droplong === "") {
            that._msg.Show(messageType.error, "Error", "Enter Drop Long");
        }
        else {
            commonfun.loader();

            var studentprofiledata = {};

            studentprofiledata = {
                "gender": that.gender, "dob": that.dob, "division": that.division,
                "pickupaddr": that.pickupaddr, "dropaddr": that.dropaddr, "otherinfo": that.otherinfo
            }

            var savePassenger = {
                "autoid": that.psngrid,
                "studentcode": that.psngrid,
                "studentname": that.psngrname,
                "schoolid": that.enttid,
                "name": that.mothername + ";" + that.fathername,
                "mobileno1": that.primarymobile,
                "mobileno2": that.secondarymobile,
                "email1": that.primaryemail,
                "email2": that.secondaryemail,
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

            that._psngrservice.savePassengerInfo(savePassenger).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_studentinfo.msg;
                    var msgid = dataResult[0].funsave_studentinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetPassengerFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
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

    // Get Passenger Data

    getPassengerDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.psngrid = params['id'];

                that._psngrservice.getPassengerDetails({ "flag": "edit", "id": that.psngrid }).subscribe(data => {
                    try {
                        that.psngrid = data.data[0].autoid;
                        that.ownerid = data.data[0].ownerid;
                        that.ownername = data.data[0].ownername;
                        that.enttid = data.data[0].schoolid;
                        that.psngrcode = data.data[0].studentcode;
                        that.psngrname = data.data[0].studentname;

                        that.aadharno = data.data[0].aadharno;
                        that.mothername = data.data[0].name.split(';')[0];
                        that.primarymobile = data.data[0].mobileno1;
                        that.primaryemail = data.data[0].email1;
                        that.secondarymobile = data.data[0].mobileno2;
                        that.secondaryemail = data.data[0].email2;
                        that.fathername = data.data[0].name.split(';')[1];
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
        this._router.navigate(['/passenger']);
    }
}
