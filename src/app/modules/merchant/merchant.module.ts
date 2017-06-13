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
                    { path: 'hotspot', loadChildren: './hotspot#HotspotModule' },
                    { path: 'rider', loadChildren: './riders#RidersModule' },
                    { path: '', loadChildren: './merchant#MerchantModule' },
                    { path: 'outlet', loadChildren: './outlet#OutletModule' },
                    { path: 'orderdashboard', loadChildren: './orderdashboard#OrderDashboardModule' },
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