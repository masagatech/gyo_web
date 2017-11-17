import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AddScheduleComponent } from './add/addschd.comp';
import { EditScheduleComponent } from './edit/editschd.comp';

import { PickDropService, EntityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, OrderListModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
    {
        path: '', children: [
            {
                path: 'add', component: AddScheduleComponent, canActivate: [AuthGuard],
                data: { "module": "schd", "submodule": "asch", "rights": "add", "urlname": "/createschedule" }
            },

            {
                path: 'edit', component: EditScheduleComponent, canActivate: [AuthGuard],
                data: { "module": "schd", "submodule": "esch", "rights": "edit", "urlname": "/changeschedule" }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), FormsModule, CommonModule,
        DataTableModule, OrderListModule, AutoCompleteModule, ScheduleModule
    ],
    declarations: [
        AddScheduleComponent,
        EditScheduleComponent
    ],

    providers: [AuthGuard, PickDropService, EntityService]
})

export class VehicleScheduleModule {

}
