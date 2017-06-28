import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketingComponent } from '../marketing/marketing.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: MarketingComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'dashboard', loadChildren: './dashboard#MarketingDashboardModule' },
                    { path: 'reports', loadChildren: './reports#MarketingReportsModule' },
                    { path: 'user', loadChildren: './users#MarketingUserModule' },
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
        MarketingComponent
    ],
    providers: [AuthGuard]
})

export class MarketingModule {

}
