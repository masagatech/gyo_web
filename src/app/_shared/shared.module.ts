import { NgModule, ModuleWithProviders } from "@angular/core";

import { DataService } from '../_services/dataconnect';
@NgModule({})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [DataService]
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
