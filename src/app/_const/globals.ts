import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    // serviceurl: string = "http://localhost:8082/goyoapi/";
    // uploadurl: string = "http://localhost:8082/images/";
    // filepath: string = "www\\uploads\\";
    // static socketurl: string = "http://localhost:8082/";

    serviceurl: string = "http://track.goyo.in:8082/goyoapi/";
    uploadurl: string = "http://track.goyo.in:8082/images/";
    filepath: string = "www/uploads/";
    static socketurl: string = "http://track.goyo.in:8082/";

    otherurl: string = "http://35.154.27.42:8081/goyoapi/";

    public static getWSDetails() {
        let _wsdetails = Cookie.get("_schwsdetails_");

        if (_wsdetails !== null) {
            return JSON.parse(_wsdetails);
        }
        else {
            return {};
        }
    }

    public static getEntityDetails() {
        let _enttdetails = Cookie.get("_schenttdetails_");

        if (_enttdetails !== null) {
            return JSON.parse(_enttdetails);
        }
        else {
            return {};
        }
    }
}