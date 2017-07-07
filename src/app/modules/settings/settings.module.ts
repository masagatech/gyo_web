import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from '../settings/settings.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { DashboardModule } from './dashboard';

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
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
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
