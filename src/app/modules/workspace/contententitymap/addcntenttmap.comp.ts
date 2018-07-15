import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ContentService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addcntenttmap.comp.html',
    providers: [CommonService]
})

export class AddContentEntityMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";
    selectedEntity: any = [];

    standardDT: string = "";
    subjectDT: any = [];

    stdid: number = 0;
    subid: number = 0;
    cid: number = 0;
    ctitle: string = "";

    contentDetailsDT: any = [];
    selectedContentDetails: any = [];
    isEditContentDetails: boolean = false;

    constructor(private _cntservice: ContentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillStandardDropDown();
        this.fillSubjectDropDown();
    }

    public ngOnInit() {

    }

    // Fill Standard Drop Down

    fillStandardDropDown() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "standard", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "wsautoid": that._wsdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.standardDT = data.data;
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

    // Fill Subject Drop Down

    fillSubjectDropDown() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "subject", "stdid": that.stdid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data;
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

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "stdwiseentity",
            "stdid": this.stdid,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        this.getContentDetails();
    }

    // Add Content Details

    isValidContentDetails() {
        var that = this;

        if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            return false;
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            return false;
        }

        return true;
    }

    // Save Content Details

    isValidation() {
        var that = this;
        var contententitymap: any = [];

        if (that.stdid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".stdname").focus();
            return false;
        }

        if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subname").focus();
            return false;
        }

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter School Name");
            $(".enttname input").focus();
            return false;
        }

        contententitymap = that.contentDetailsDT.filter(a => a.isvisible == true);
        
        if (contententitymap.length == 0) {
            that._msg.Show(messageType.error, "Error", "Please select Atleast 1 Is Visible");
            return false;
        }

        return true;
    }

    saveContentDetails() {
        var that = this;
        var isvalid: boolean = false;
        var contententitymap: any = [];
        
        isvalid = that.isValidation();

        if (isvalid) {
            commonfun.loader();

            contententitymap = that.contentDetailsDT.filter(a => a.isvisible == true)

            for (var i = 0; i < contententitymap.length; i++) {
                contententitymap[i].enttid = that.enttid;
                contententitymap[i].wsautoid = that._wsdetails.wsautoid;
            }

            this._cntservice.saveContentEntityMap({ "contententitymap": contententitymap }).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_contententitymap;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.getContentDetails();
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

    getContentDetails() {
        var that = this;
        commonfun.loader();

        that._cntservice.getContentDetails({
            "flag": "forenttmap", "stdid": that.stdid, "subid": that.subid, "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.cid = data.data[0].cid;
                    that.ctitle = data.data[0].ctitle;
                    that.contentDetailsDT = data.data;
                }
                else {
                    that.cid = 0;
                    that.ctitle = "";
                    that.contentDetailsDT = [];
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
}
