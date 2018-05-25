import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InventoryComponent } from './inventory.comp';

export const routes = [
    {
        path: '',
        component: InventoryComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './dashboard#DashboardModule' },
                    { path: 'device', loadChildren: './device#DeviceModule' },
                    { path: 'sim', loadChildren: './sim#SimModule' },
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
        InventoryComponent
    ],
    providers: [AuthGuard]
})

export class InventoryModule {

}
