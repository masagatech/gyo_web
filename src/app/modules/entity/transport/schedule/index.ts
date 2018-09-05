import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, CommonService } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ViewScheduleComponent } from './view/viewschd.comp';
import { AddScheduleComponent } from './add/addschd.comp';
import { EditScheduleComponent } from './edit/editschd.comp';

import { PickDropService, EntityService } from '@services/master';

import { DataTableModule, OrderListModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
    {
        path: '', children: [
            {
                path: '', component: ViewScheduleComponent, canActivate: [AuthGuard],
                data: { "module": "trnsp", "submodule": "schd", "rights": "view", "urlname": "/view" }
            },
            {
                path: 'add', component: AddScheduleComponent, canActivate: [AuthGuard],
                data: { "module": "trnsp", "submodule": "schd", "rights": "add", "urlname": "/add" }
            },
            {
                path: 'edit', component: EditScheduleComponent, canActivate: [AuthGuard],
                data: { "module": "trnsp", "submodule": "schd", "rights": "edit", "urlname": "/edit" }
            },
            {
                path: 'edit/:id', component: EditScheduleComponent, canActivate: [AuthGuard],
                data: { "module": "trnsp", "submodule": "schd", "rights": "edit", "urlname": "/edit" }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), FormsModule, CommonModule,
        DataTableModule, OrderListModule, AutoCompleteModule, ScheduleModule
    ],
    declarations: [
        ViewScheduleComponent,
        AddScheduleComponent,
        EditScheduleComponent
    ],

    providers: [AuthGuard, CommonService, PickDropService, EntityService]
})

export class VehicleScheduleModule {

}
