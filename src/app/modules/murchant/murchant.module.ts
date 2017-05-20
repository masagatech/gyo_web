import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MurchantComponent } from '../murchant/murchant.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { DashboardModule } from './dashboard';

import { CreateOrderComponent } from './order/credord';
import { ViewOrderComponent } from './order/vieword';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: MurchantComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
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
        MurchantComponent
    ],
    providers: [AuthGuard]
})

export class MurchantModule {

}
