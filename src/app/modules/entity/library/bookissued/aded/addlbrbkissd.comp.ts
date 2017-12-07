import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { retry } from 'rxjs/operator/retry';

declare var google: any;

@Component({
    templateUrl: 'addlbrbkissd.comp.html',
    providers: [CommonService]
})

export class AddLibraryBookIssuedComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    libraryDT: any = [];
    subjectDT: any = [];
    personTypeDT: any = [];
    classDT: any = [];
    booksDT: any = [];
    bookNoDT: any = [];

    personDT: any = [];
    selectedPerson: any = [];

    issdparamid: number = 0;
    issdid: number = 0;
    ayid: number = 0;
    librid: number = 0;
    subid: number = 0;
    classid: number = 0;
    personid: number = 0;
    personname: string = "";
    persontype: string = "student";
    bookid: number = 0;
    bookno: number = 0;
    issddate: any = "";

    lmtissd: number = 0;
    aftrlmtfine: any = "0";

    bookIssuedDT: any = [];
    selectedBookIssued: any = [];
    iseditbkissd: boolean = false;

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _librservice: LibraryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillBooksDropDown();
        this.fillBookNoDropDown();
    }

    public ngOnInit() {
        this.editLibraryBookIssued();
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
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.libraryDT = data.data.filter(a => a.group == "library");
                that.subjectDT = data.data.filter(a => a.group == "subject");
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

    // Get Book No

    fillBooksDropDown() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBookIssued({
            "flag": "books", "librid": that.librid, "subid": that.subid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.booksDT = data.data;

                if (data.data.length > 0) {
                    that.lmtissd = data.data[0].lmtissd;
                    that.aftrlmtfine = data.data[0].aftrlmtfine;
                }
                else {
                    that.lmtissd = 0;
                    that.aftrlmtfine = "0";
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

    // Get Book No

    fillBookNoDropDown() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBookIssued({
            "flag": "bookno", "librid": that.librid, "subid": that.subid, "bookid": that.bookid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.bookNoDT = data.data;

                if (data.data.length > 0) {
                    that.lmtissd = data.data[0].lmtissd;
                    that.aftrlmtfine = data.data[0].aftrlmtfine;
                }
                else {
                    that.lmtissd = 0;
                    that.aftrlmtfine = "0";
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

    // Clear Subject Fields

    resetSubjectFields() {
        var that = this;

        that.ayid = 0;
        that.librid = 0;
        that.subid = 0;
        that.bookIssuedDT = [];
        that.remark = "";
    }

    // Add Book No

    isValidBookNo() {
        var that = this;

        if (that.librid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Library");
            return false;
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            return false;
        }
        else if (that.bookno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Book No");
            return false;
        }
        else {
            var _bookissued = that.bookIssuedDT.filter(a => a.bookno != that.bookno);

            if (that.bookIssuedDT.length != 0) {
                for (var i = 0; i < that.bookIssuedDT.length; i++) {
                    var existsflds = that.bookIssuedDT[i];

                    if (existsflds.bookid == that.bookid && existsflds.bookno == that.bookno) {
                        that._msg.Show(messageType.error, "Error", "Duplicate Book & Book No Not Available");
                        return false;
                    }
                }
            }
        }

        return true;
    }

    addBookIssued() {
        var that = this;
        var validmsg: string = "";
        var isvalidbook: boolean = false;

        commonfun.loader();

        that._librservice.getLibraryBookIssued({
            "flag": "validbookno", "bookno": that.bookno, "bookid": that.bookid, "subid": that.subid, "librid": that.librid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    validmsg = data.data[0].validmsg;
                    isvalidbook = that.isValidBookNo();

                    if (isvalidbook) {
                        if (validmsg == "success") {
                            that.bookIssuedDT.push({
                                "bookid": that.bookid, "bookname": $(".bookname option:selected").text().trim(),
                                "bookno": that.bookno, "lmtissd": that.lmtissd, "aftrlmtfine": that.aftrlmtfine
                            });

                            that.totalIssuedFine();
                            that.resetBookIssuedFields();
                        }
                        else {
                            that._msg.Show(messageType.error, "Error", validmsg);
                        }
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

    totalIssuedFine() {
        var _totissdfine: number = 0;

        for (var i = 0; i < this.bookIssuedDT.length; i++) {
            _totissdfine += parseFloat(this.bookIssuedDT[i].aftrlmtfine);
        }

        return _totissdfine;
    }

    // Edit Book Issued

    editBookIssued(row) {
        var that = this;

        that.selectedBookIssued = row;
        that.bookid = row.bookid;
        that.fillBookNoDropDown();
        that.bookno = row.bookno;
        that.lmtissd = row.lmtissd;
        that.aftrlmtfine = row.aftrlmtfine;
        that.iseditbkissd = true;
    }

    // Delete Book Issued

    deleteBookIssued(row) {
        this.bookIssuedDT.splice(this.bookIssuedDT.indexOf(row), 1);
    }

    // Update Book Issued

    updateBookIssued() {
        var that = this;
        var isvalidbook: boolean = false;

        isvalidbook = that.isValidBookNo();

        if (isvalidbook) {
            that.selectedBookIssued.bookid = that.bookid;
            that.selectedBookIssued.bookname = $(".bookname option:selected").text().trim();
            that.selectedBookIssued.bookno = that.bookno;
            that.selectedBookIssued.issddate = that.issddate;
            that.iseditbkissd = false;

            that.resetBookIssuedFields();
        }
    }

    // Reset Book Issued

    resetBookIssuedFields() {
        var that = this;

        that.bookid = 0;
        that.bookno = 0;
        that.lmtissd = 0;
        that.aftrlmtfine = 0;
        that.iseditbkissd = false;
    }

    resetAllBookIssuedFields() {
        var that = this;

        that.issdid = 0;
        that.librid = 0;
        that.subid = 0;
        that.persontype = "student";
        that.classid = 0;
        that.personid = 0;
        that.personname = "";
        that.selectedPerson = [];
        that.issddate = "";
        that.bookIssuedDT = [];

        that.resetBookIssuedFields();
    }

    // Save Book Issued Issued

    saveLibraryBookIssued() {
        var that = this;
        var params = {};

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
        }
        else if (that.librid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Library");
            $(".librname").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subname").focus();
        }
        else if (that.personid == 0 || that.personname == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.persontype + " Name");
            $(".personname input").focus();
        }
        else if (that.issddate == "") {
            that._msg.Show(messageType.error, "Error", "Enter Issued Date");
            $(".issddate").focus();
        }
        else if (that.bookIssuedDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "Please Atleast 1 Book Issued");
            $(".bookname").focus();
        }
        else {
            commonfun.loader();

            params = {
                "typ": "issued", "issdid": that.issdid, "ayid": that.ayid, "librid": that.librid, "subid": that.subid, "psngrid": that.personid,
                "psngrtype": that.persontype, "issddate": that.issddate, "bookissdt": that.bookIssuedDT, "remark": that.remark,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "cuid": that.loginUser.ucode
            };

            this._librservice.saveLibraryBookIssued(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_librarybookissued;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (that.issdparamid == 0) {
                            that.resetAllBookIssuedFields();
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

    // Get Book Issued

    editLibraryBookIssued() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.issdparamid = params['id'];
                that.getLibraryBookIssued();
            }
            else {
                that.resetAllBookIssuedFields();
                commonfun.loaderhide();
            }
        });
    }

    getLibraryBookIssued() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBookIssued({
            "flag": "edit", "issdid": that.issdparamid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.issdid = data.data[0].issdid;
                    that.ayid = data.data[0].ayid;
                    that.librid = data.data[0].librid;
                    that.subid = data.data[0].subid;
                    that.persontype = data.data[0].psngrtype;
                    that.classid = data.data[0].classid;
                    that.personid = data.data[0].psngrid;
                    that.personname = data.data[0].psngrname;
                    that.selectedPerson.value = that.personid;
                    that.selectedPerson.label = that.personname;
                    that.issddate = data.data[0].issddate;

                    that.fillBooksDropDown();

                    that.bookIssuedDT = data.data[0].bookissdt;
                    that.remark = data.data[0].remark;
                }
                else {
                    that.resetAllBookIssuedFields();
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
        this._router.navigate(['/master/bookissued']);
    }
}
