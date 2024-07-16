import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { LayoutComponent } from './paginas/layout/layout.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LayoutInformaticaComponent } from './paginas/departamentos/informatica/layout-informatica/layout-informatica.component';
import { BolsahorasInformaticaComponent } from './paginas/departamentos/informatica/bolsahoras-informatica/bolsahoras-informatica.component';
import { SolicitudesInformaticaComponent } from './paginas/departamentos/informatica/solicitudes-informatica/solicitudes-informatica.component';
import { InicioInformaticaComponent } from './paginas/departamentos/informatica/inicio-informatica/inicio-informatica.component';

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
        children: [

          {
            path: 'inicio',
            component:InicioComponent
          },
          {
            path:'informatica',
            component:LayoutInformaticaComponent,
            children:[
              {
                path:'inicio-informatica',
                component:InicioInformaticaComponent

              }
              ,
            {
              path:'bolsa-horas',
              component:BolsahorasInformaticaComponent

            },
            {
              path:'solicitudes-informatica',
              component:SolicitudesInformaticaComponent

            }

            ]
          }
        ]

      }


];
