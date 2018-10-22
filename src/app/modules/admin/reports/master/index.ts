import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

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
                    { path: 'workspace', loadChildren: './workspace#WorkspaceReportsModule' },
                    { path: 'entity', loadChildren: './entity#EntityReportsModule' },
                    { path: 'users', loadChildren: './users#UserReportsModule' },
                    { path: 'driver', loadChildren: './driver#DriverMasterReportsModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleMasterReportsModule' },
                    { path: 'parents', loadChildren: './parents#ParentsReportsModule' }
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

export class AdminMasterReportsModule {

}