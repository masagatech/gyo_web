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

