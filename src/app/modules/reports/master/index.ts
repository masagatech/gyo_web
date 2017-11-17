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
                    { path: 'class', loadChildren: './class#ClassReportsModule' },
                    { path: 'books', loadChildren: './books#BooksReportsModule' },
                    { path: 'chapter', loadChildren: './chapter#ChapterReportsModule' },
                    { path: 'activity', loadChildren: './activity#ActivityReportsModule' },
                    { path: 'gallery', loadChildren: './gallery#GalleryReportsModule' },
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