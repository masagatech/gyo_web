import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ProspectusService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addprspctissue.comp.html',
    providers: [CommonService]
})

export class AddProspectusIssuesComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    prospectusDT: any = [];
    formnoDT: any = [];

    genderDT: any = [];
    classDT: any = [];

    prspctparamid: number = 0;
    issuesid: number = 0;
    ayid: number = 0;
    prspctid: number = 0;
    prntname: string = "";
    prntmob: string = "";
    childname: string = "";
    gender: string = "";
    classid: number = 0;
    prspctfees: any = "";
    issuefees: any = "0";

    prospectusIssuesDT: any = [];
    selectedChildData: any = [];
    formno: number = 0;
    iseditformno: boolean = false;

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _prspctservice: ProspectusService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getFormNo();
    }

    public ngOnInit() {
        this.editProspectusIssues();
    }

    // Fill Academic Year, Prospectus, Gender, Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._prspctservice.getProspectusIssues({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.prospectusDT = data.data.filter(a => a.group == "prospectus");
                that.genderDT = data.data.filter(a => a.group == "gender");
                that.classDT = data.data.filter(a => a.group == "class");
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

    // Get Form No

    getFormNo() {
        var that = this;
        commonfun.loader();

        that._prspctservice.getProspectusIssues({
            "flag": "form", "prspctid": that.prspctid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.formnoDT = data.data;

                if (that.prspctparamid == 0) {
                    if (data.data.length > 0) {
                        that.prspctfees = data.data[0].fees;
                    }
                    else {
                        that.prspctfees = 0;
                    }
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

    // Clear Prospectus Fields

    resetProspectusFields() {
        var that = this;

        that.ayid = 0;
        that.prntname = "";
        that.prospectusIssuesDT = [];
        that.remark = "";
    }

    // Add From No

    isValidFormNo() {
        var that = this;

        if (that.prspctid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Prospectus No");
            return false;
        }
        else if (that.formno.toString() == "" && that.formno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Form No");
            return false;
        }
        else {
            if (that.iseditformno == false) {
                for (var i = 0; i < that.prospectusIssuesDT.length; i++) {
                    var issflds = that.prospectusIssuesDT[i];

                    if (issflds.formno == that.formno) {
                        that._msg.Show(messageType.error, "Error", "This Form No is Already Used");
                        return false;
                    }
                }
            }
            else {
                var _prspctissues = that.prospectusIssuesDT.filter(a => a.formno != that.formno);

                if (_prspctissues.length != 0) {
                    for (var i = 0; i < _prspctissues.length; i++) {
                        var existsflds = _prspctissues[i];

                        if (existsflds.formno == that.formno) {
                            that._msg.Show(messageType.error, "Error", "This Form No is Already Used");
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    addChildData() {
        var that = this;
        var validmsg: string = "";
        var isvalidform: boolean = false;

        commonfun.loader();

        that._prspctservice.getProspectusIssues({
            "flag": "validform", "formno": that.formno, "prspctid": that.prspctid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    validmsg = data.data[0].validmsg;
                    isvalidform = that.isValidFormNo();

                    if (isvalidform) {
                        if (validmsg == "success") {
                            that.prospectusIssuesDT.push({
                                "ayid": 0, "issuesid": 0, "prspctid": 0, "prntname": "", "prntmob": "", "childname": that.childname,
                                "gender": that.gender, "gndrnm": $(".gender option:selected").text().trim(),
                                "classid": that.classid, "classname": $(".classname option:selected").text().trim(),
                                "formno": that.formno, "fees": 0, "remark": "", "cuid": "", "enttid": 0, "wsautoid": 0,
                                "isactive": true
                            });

                            that.issuefees = that.prspctfees * that.prospectusIssuesDT.filter(a => a.isactive == true).length;
                            that.resetChildData();
                        }
                        else {
                            that._msg.Show(messageType.error, "Error", validmsg);
                        }
                    }
                }
                else {
                    that.prspctfees = 0;
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

    // Edit Prospectus No

    editChildData(row) {
        var that = this;

        that.selectedChildData = row;
        that.childname = row.childname;
        that.gender = row.gender;
        that.classid = row.classid;
        that.formno = row.formno;
        that.iseditformno = true;
    }

    // Delete Prospectus No

    deleteChildData(row) {
        row.isactive = false;
        this.issuefees = this.prspctfees * this.prospectusIssuesDT.filter(a => a.isactive == true).length;
    }

    // Update Prospectus No

    updateChildData() {
        var that = this;
        var isvalidform: boolean = false;

        isvalidform = that.isValidFormNo();

        if (isvalidform) {
            that.selectedChildData.childname = that.childname;
            that.selectedChildData.gender = that.gender;
            that.selectedChildData.gndrnm = $(".gender option:selected").text().trim();
            that.selectedChildData.classid = that.classid;
            that.selectedChildData.classname = $(".classname option:selected").text().trim();
            that.selectedChildData.formno = that.formno;
            that.iseditformno = false;

            that.resetChildData();
        }
    }

    // Reset Prospectus No

    resetChildData() {
        var that = this;

        that.childname = "";
        that.gender = "";
        that.classid = 0;
        that.formno = 0;
        that.iseditformno = false;
    }

    // Save Prospectus Issues

    saveProspectusIssues() {
        var that = this;
        var _prspctissues: any = [];

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
        }
        else if (that.prspctid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Prospectus");
            $(".prspctname").focus();
        }
        else if (that.prntname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Parent Name");
            $(".prntname").focus();
        }
        else if (that.prntmob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".prntmob").focus();
        }
        else if (that.prospectusIssuesDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "Please Atleast 1 Prospectus No");
            $(".formno").focus();
        }
        else {
            commonfun.loader();

            for (var i = 0; i < that.prospectusIssuesDT.length; i++) {
                that.prospectusIssuesDT[i].prspctid = that.prspctid;
                that.prospectusIssuesDT[i].ayid = that.ayid;
                that.prospectusIssuesDT[i].prntname = that.prntname;
                that.prospectusIssuesDT[i].prntmob = that.prntmob;
                that.prospectusIssuesDT[i].fees = that.issuefees;
                that.prospectusIssuesDT[i].remark = that.remark;
                that.prospectusIssuesDT[i].cuid = that.loginUser.ucode;
                that.prospectusIssuesDT[i].enttid = that._enttdetails.enttid;
                that.prospectusIssuesDT[i].wsautoid = that._enttdetails.wsautoid;
            }

            this._prspctservice.saveProspectusIssues({ "prospectusissues": that.prospectusIssuesDT }).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_prospectusissues;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (that.prspctparamid == 0) {
                            that.resetProspectusFields();
                            that.getFormNo();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Prospectus

    editProspectusIssues() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.prspctparamid = params['id'];
                that.getProspectusIssues();
            }
            else {
                that.resetProspectusFields();
                commonfun.loaderhide();
            }
        });
    }

    getProspectusIssues() {
        var that = this;
        commonfun.loader();

        that._prspctservice.getProspectusIssues({
            "flag": "edit", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "prspctid": that.prspctparamid,
            "ayid": that.ayid, "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var viewass = data.data;

                if (viewass.length > 0) {
                    that.ayid = viewass[0].ayid;
                    that.prspctid = viewass[0].prspctid;
                    that.getFormNo();
                    
                    that.prspctfees = viewass[0].fees;

                    that.prntname = viewass[0].prntname;
                    that.prntmob = viewass[0].prntmob;

                    that.prospectusIssuesDT = viewass[0].childlist;

                    that.remark = viewass[0].remark;
                }
                else {
                    that.prntname = "";
                    that.prospectusIssuesDT = [];
                    that.remark = "";
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/prospectus/issues']);
    }
}
