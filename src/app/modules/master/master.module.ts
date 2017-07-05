import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from '../master/master.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: MasterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'entity', loadChildren: './entity#EntityModule' },
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },
                    { path: 'user', loadChildren: './users#UserModule' },
                    { path: 'location', loadChildren: './location#LocationModule' },
                    { path: 'route', loadChildren: './route#RouteModule' },
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
        MasterComponent
    ],
    providers: [AuthGuard]
})

export class MasterModule {

}
