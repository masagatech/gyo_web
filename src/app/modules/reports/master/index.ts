import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'batch', loadChildren: './batch#BatchReportsModule' },
                    { path: 'route', loadChildren: './route#RouteReportsModule' },
                    { path: 'driver', loadChildren: './driver#DriverReportsModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleReportsModule' },
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
    providers: [AuthGuard]
})

export class MasterReportsModule {

}