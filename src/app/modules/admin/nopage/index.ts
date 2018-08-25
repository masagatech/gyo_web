import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NoPageComponent } from './nopage.comp';

export const routes = [
    {
        path: '',
        component: NoPageComponent,
        children: [
            { path: '', component: NoPageComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule, FormsModule, RouterModule.forChild(routes)
    ],
    declarations: [
        NoPageComponent
    ],
    entryComponents: [],
})

export class NoPageModule {

}
