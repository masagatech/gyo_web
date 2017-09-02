import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from '../settings/settings.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'masterofmaster', loadChildren: './mom#MOMModule' },
                    { path: 'usermenumap', loadChildren: './usermenumap#UserMenuMapModule' },
                    { path: 'uservehiclemap', loadChildren: './uservehmap#UserVehicleMapModule' },
                    { path: 'breakdown', loadChildren: './breakdown#BreakDownModule' },
                    { path: 'general', loadChildren: './general#GeneralModule' },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        SharedComponentModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [
        SettingsComponent
    ],
    providers: [AuthGuard]
})

export class SettingsModule {

}
