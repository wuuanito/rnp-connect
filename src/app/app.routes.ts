import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { LayoutComponent } from './paginas/layout/layout.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'layout',
        component: LayoutComponent,
       
      }


];
