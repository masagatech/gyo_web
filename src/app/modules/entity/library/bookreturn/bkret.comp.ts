import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'bkret.comp.html',
    providers: [CommonService]
})

export class BookReturnComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    libraryDT: any = [];
    subjectDT: any = [];
    personTypeDT: any = [];
    classDT: any = [];

    personDT: any = [];
    selectedPerson: any = [];

    ayid: number = 0;
    librid: number = 0;
    classid: number = 0;
    personid: number = 0;
    personname: string = "";
    persontype: string = "student";
    remark: string = "";

    bookIssuedDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _librservice: LibraryService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getLibraryBookIssued();
    }

    public ngOnInit() {

    }

    // Fill Academic Year, Library, Subject, Book Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._librservice.getLibraryBooks({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].key;
                        }
                        else {
                            that.ayid = 0;
                        }
                    }
                }

                that.libraryDT = data.data.filter(a => a.group == "library");
                that.subjectDT = data.data.filter(a => a.group == "librarysubject");
                that.personTypeDT = data.data.filter(a => a.group == "persontype");
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

    // Auto Completed Person

    getPersonData(event, _persontype, _classid) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "psngrtype": _persontype,
            "classid": _classid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.personDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Person

    selectPersonData(event) {
        this.personid = event.value;
        this.personname = event.label;
    }

    // Get Book Issued

    getLibraryBookIssued() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBookIssued({
            "flag": "issued", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": that.ayid, "librid": that.librid,
            "psngrid": that.personid, "psngrtype": that.persontype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.bookIssuedDT = data.data;
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

    saveBookReturn() {
        var that = this;
        var _bkretdt = [];
        var params = {};

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
        }
        else if (that.librid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Library");
            $(".librname").focus();
        }
        else if (that.personid == 0 || that.personname == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.persontype + " Name");
            $(".personname input").focus();
        }
        else if (that.bookIssuedDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "Please Atleast 1 Book Issued");
            $(".bookname").focus();
        }
        else {
            commonfun.loader();

            _bkretdt = that.bookIssuedDT.filter(a => a.retdate != "" && a.retdate != null);

            params = {
                "typ": "return", "ayid": that.ayid, "librid": that.librid, "psngrid": that.personid,
                "psngrtype": that.persontype, "librbookretdt": _bkretdt, "remark": that.remark,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
            };

            that._librservice.saveLibraryBookReturn(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_librarybookreturn;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    that._msg.Show(messageType.success, "Success", msg);
                    that.getLibraryBookIssued();
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
                // console.log("Complete");
            });
        }
    }
}
