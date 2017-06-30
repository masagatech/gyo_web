import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/auth-service'
import { LoginService } from '../_services/login/login-service';
import { MessageService, messageType } from '../_services/messages/message-service';
import { UserReq, LoginUserModel } from '../_model/user_model';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'login.comp.html',
    providers: [AuthenticationService]
})

export class LoginComponent implements OnInit {
    public errorMsg = '';
    public btnLoginText = 'Login';
    _user = new UserReq("", "");

    constructor(private _router: Router, private _service: AuthenticationService, private _loginservice: LoginService, private _msg: MessageService) {
        var that = this;
        var checks = this._service.checkCredentials();

        if (checks.status) that._router.navigate(['/']);

        if (checks.takefrmdb) {
            that._service.getSession(function (e) {
                if (e == "success")
                    that._router.navigate(['/']);
            }, checks);
        }

        Cookie.deleteAll();
    }

    login(e) {
        var that = this;
        that.btnLoginText = "Loging..";

        commonfun.loader("#loginloader");

        that._service.login(that._user).subscribe(d => {
            try {
                if (d) {
                    if (d.status) {
                        let usrobj = d.data;
                        let userDetails: LoginUserModel = usrobj[0];

                        if (userDetails.status) {
                            that._loginservice.setUsers(userDetails);

                            if (userDetails.issysadmin) {
                                that._router.navigate(['/workspace']);
                            }
                            else {
                                Cookie.set("_wsdetails_", JSON.stringify(userDetails));
                                that._router.navigate(['/']);
                            }
                        } else {
                            that._msg.Show(messageType.error, "Error", userDetails.errmsg);
                        }
                    }
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            
            commonfun.loaderhide("#loginloader");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#loginloader");
        });

        e.preventDefault();
    }

    ngOnInit() {

    }
}