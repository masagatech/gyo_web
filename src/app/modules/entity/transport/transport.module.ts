import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransportComponent } from './transport.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: TransportComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'schedule', loadChildren: './schedule#VehicleScheduleModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'thirdpartyintegration', loadChildren: './thirdpartyintegration#ThirdPartyIntegrationModule' },
                    { path: 'route', loadChildren: './route#RouteModule' },
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'student', loadChildren: './student#StudentVehicleModule' },
                    { path: 'uservehiclemap', loadChildren: './uservehmap#UserVehicleMapModule' },
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
        TransportComponent
    ],
    providers: [AuthGuard]
})

export class TransportModule {

}
