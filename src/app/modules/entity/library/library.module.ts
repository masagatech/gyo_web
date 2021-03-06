import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryComponent } from './library.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: LibraryComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    // Library

                    { path: 'library', loadChildren: './library#LibraryMasterModule' },
                    { path: 'librarybooks', loadChildren: './books#LibraryBooksModule' },
                    { path: 'bookissued', loadChildren: './bookissued#LibraryBookIssuedModule' },
                    { path: 'bookreturn', loadChildren: './bookreturn#LibraryBookReturnModule' },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        SharedComponentModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [
        LibraryComponent
    ],
    providers: [AuthGuard]
})

export class LibraryModule {

}
