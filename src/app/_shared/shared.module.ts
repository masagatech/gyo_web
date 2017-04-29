import { NgModule, ModuleWithProviders } from "@angular/core";
import { AuthenticationService } from "../_services/auth-service";
import { LoginService } from "../_services/login/login-service"
import { AuthGuard } from "../_services/authguard-service"
import { DataService } from '../_services/dataconnect';

@NgModule({})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [AuthenticationService, LoginService, AuthGuard, DataService]
        };
    }
}

import { MessageService } from "../_services/messages/message-service";
import { ConfirmationService } from 'primeng/primeng';

@NgModule({})

export class GlobalShared {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GlobalShared,
            providers: [MessageService, ConfirmationService]
        };
    }
}
