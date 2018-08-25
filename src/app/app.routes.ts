import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';

import { LoginComponent } from './login/login.comp';

export const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', loadChildren: './modules#ModuleModule' },
  
  { path: '**', component: NoContentComponent },
];
