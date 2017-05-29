import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MerchantComponent } from '../merchant/merchant.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { DashboardModule } from './dashboard';

import { CreateOrderComponent } from './order/credord';
import { ViewOrderComponent } from './order/vieword';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: MerchantComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'entity', loadChildren: './entity#EntityModule' },
                    { path: 'outlet', loadChildren: './outlet#OutletModule' },
                    { path: '', loadChildren: './order#OrderModule' },
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
        MerchantComponent
    ],
    providers: [AuthGuard]
})

export class MerchantModule {

}
