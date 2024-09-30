import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { LayoutComponent } from './paginas/layout/layout.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LayoutInformaticaComponent } from './paginas/departamentos/informatica/layout-informatica/layout-informatica.component';
import { BolsahorasInformaticaComponent } from './paginas/departamentos/informatica/bolsahoras-informatica/bolsahoras-informatica.component';
import { SolicitudesInformaticaComponent } from './paginas/departamentos/informatica/solicitudes-informatica/solicitudes-informatica.component';
import { InicioInformaticaComponent } from './paginas/departamentos/informatica/inicio-informatica/inicio-informatica.component';
import { LayoutComprasComponent } from './paginas/departamentos/compras/layout-compras/layout-compras.component';
import { InicioComprasComponent } from './paginas/departamentos/compras/inicio-compras/inicio-compras.component';
import { SolicitudesComprasComponent } from './paginas/departamentos/compras/solicitudes-compras/solicitudes-compras.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CalendarioComponent } from './paginas/calendario/calendario.component';
import { LayoutProduccionComponent } from './paginas/departamentos/produccion/layout-produccion/layout-produccion.component';
import { InicioProduccionComponent } from './paginas/departamentos/produccion/inicio-produccion/inicio-produccion.component';
import { SolicitudesProduccionComponent } from './paginas/departamentos/produccion/solicitudes-produccion/solicitudes-produccion.component';
import { LayoutRrhhComponent } from './paginas/departamentos/rrhh/layout-rrhh/layout-rrhh.component';
import path from 'path';
import { InicioRrhhComponent } from './paginas/departamentos/rrhh/inicio-rrhh/inicio-rrhh.component';
import { SolicitudesRrhhComponent } from './paginas/departamentos/rrhh/solicitudes-rrhh/solicitudes-rrhh.component';
import { LayoutAdministracionComponent } from './paginas/departamentos/administracion/layout-administracion/layout-administracion.component';
import { InicioAdministracionComponent } from './paginas/departamentos/administracion/inicio-administracion/inicio-administracion.component';
import { SolicitudesAdminsitracionComponent } from './paginas/departamentos/administracion/solicitudes-adminsitracion/solicitudes-adminsitracion.component';
import { LayoutLaboratorioComponent } from './paginas/departamentos/laboratorio/layout-laboratorio/layout-laboratorio.component';
import { InicioLaboratorioComponent } from './paginas/departamentos/laboratorio/inicio-laboratorio/inicio-laboratorio.component';
import { SolicitudesLaboratorioComponent } from './paginas/departamentos/laboratorio/solicitudes-laboratorio/solicitudes-laboratorio.component';
import { LayoutGerenciaComponent } from './paginas/departamentos/gerencia/layout-gerencia/layout-gerencia.component';
import { SolicitudesGerenciaComponent } from './paginas/departamentos/gerencia/solicitudes-gerencia/solicitudes-gerencia.component';
import { LayoutMantenimientoComponent } from './paginas/departamentos/mantenimiento/layout-mantenimiento/layout-mantenimiento.component';
import { InicioMantenimientoComponent } from './paginas/departamentos/mantenimiento/inicio-mantenimiento/inicio-mantenimiento.component';
import { SolicitudesManteniminentoComponent } from './paginas/departamentos/mantenimiento/solicitudes-manteniminento/solicitudes-manteniminento.component';
import { LayoutOficinaTecnicaComponent } from './paginas/departamentos/oficina-tecnica/layout-oficina-tecnica/layout-oficina-tecnica.component';
import { InicioOficinaTecnicaComponent } from './paginas/departamentos/oficina-tecnica/inicio-oficina-tecnica/inicio-oficina-tecnica.component';
import { SolicitudesOficinaTecnicaComponent } from './paginas/departamentos/oficina-tecnica/solicitudes-oficina-tecnica/solicitudes-oficina-tecnica.component';
import { informaticaGuard } from './core/guards/informatica.guard';
import { comprasGuard } from './core/guards/compras.guard';
import { produccionGuard } from './core/guards/produccion.guard';
import { rrhhGuard } from './core/guards/rrhh.guard';
import { administracionGuard } from './core/guards/administracion.guard';
import { laboratorioGuard } from './core/guards/laboratorio.guard';
import { gerenciaGuard } from './core/guards/gerencia.guard';
import { manteniminentoGuard } from './core/guards/manteniminento.guard';
import { oficinatecGuard } from './core/guards/oficinatec.guard';
import { logisticaGuard } from './core/guards/logistica.guard';
import { LayoutLogisticaComponent } from './paginas/departamentos/logistica/layout-logistica/layout-logistica.component';
import { InicioLogisticaComponent } from './paginas/departamentos/logistica/inicio-logistica/inicio-logistica.component';
import { SolicitudesLogisticaComponent } from './paginas/departamentos/logistica/solicitudes-logistica/solicitudes-logistica.component';
import { CalendarioComunComponent } from './paginas/calendario-comun/calendario-comun.component';
import { CalendarioProjectComponent } from './paginas/calendario-project/calendario-project.component';
import { SolicitudPersonalComponent } from './paginas/personal/solicitud-personal/solicitud-personal.component';
import { GestionComponent } from './paginas/personal/gestion/gestion.component';
import { personalGuard } from './core/guards/personal.guard';
import { CrearSolicitudMuestrasComponent } from './paginas/departamentos/oficina-tecnica/crear-solicitud-muestras/crear-solicitud-muestras.component';
import { CrearSolicitudMuestrasLabComponent } from './paginas/departamentos/laboratorio/crear-solicitud-muestras-lab/crear-solicitud-muestras-lab.component';
import { VerSolicitudMuestrasLabComponent } from './paginas/departamentos/laboratorio/ver-solicitud-muestras-lab/ver-solicitud-muestras-lab.component';
import { CrearSolicitudMuestrasLogisticaComponent } from './paginas/departamentos/logistica/crear-solicitud-muestras-logistica/crear-solicitud-muestras-logistica.component';
import { VerSolicitudMuestrasLogisticaComponent } from './paginas/departamentos/logistica/ver-solicitud-muestras-logistica/ver-solicitud-muestras-logistica.component';
import { RegistroPlantaComponent } from './paginas/departamentos/gerencia/registro-planta/registro-planta.component';
import { CalendarioFernandoCarlosComponent } from './paginas/departamentos/gerencia/calendario-fernando-carlos/calendario-fernando-carlos.component';
import { LayoutInternacionalComponent } from './paginas/departamentos/compras copy/layout-internacional/layout-internacional.component';
import { InicioInternacionalComponent } from './paginas/departamentos/compras copy/inicio-internacional/inicio-internacional.component';
import { SolicitudesInternacionalComponent } from './paginas/departamentos/compras copy/solicitudes-internacional/solicitudes-internacional.component';
import { internacionalGuard } from './core/guards/internacional.guard';
import { CrearSolicitudAlmacenComponent } from './paginas/departamentos/laboratorio/crear-solicitud-almacen/crear-solicitud-almacen.component';
import { VerMateriasPrimasAlmacenComponent } from './paginas/departamentos/laboratorio/ver-materias-primas-almacen/ver-materias-primas-almacen.component';
import { SolicitudesMuestraAlmacenComponent } from './paginas/departamentos/logistica/solicitudes-muestra-almacen/solicitudes-muestra-almacen.component';
import { VerSolicitudMuestrasComponent } from './paginas/departamentos/oficina-tecnica/ver-solicitud-muestras/ver-solicitud-muestras.component';

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
        canActivate: [AuthGuard],
        children: [

          {
            path: 'inicio',
            component:InicioComponent
          },
          {
            path:'calendario',
            component:CalendarioComponent
          },
          {
            path:'calendario-comun',
            component:CalendarioComunComponent
          },
          {
            path:'calendario-project',
            component:CalendarioProjectComponent
          },
          {
            path:'solicitud-personal',
            component:SolicitudPersonalComponent
          },
          {
            path:'gestion',
            canActivate:[personalGuard],
            component:GestionComponent
          },

          {
            path:'informatica',
            component:LayoutInformaticaComponent,
            canActivate:[informaticaGuard],
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
          },
          {
            path:'compras',
            component:LayoutComprasComponent,
            canActivate:[comprasGuard],
            children:[
              {
                path:'inicio-compras',
                component:InicioComprasComponent
              },
              {
                path:'solicitudes-compras',
                component:SolicitudesComprasComponent
              }
            ]
          },
          {
            path:'produccion',
            component:LayoutProduccionComponent,
            canActivate:[produccionGuard],
            children:[
              {
                path:'inicio-produccion',
                component:InicioProduccionComponent
              },
              {
                path:'solicitudes-produccion',
                component:SolicitudesProduccionComponent
              }
            ]
          },
          {
            path:'rrhh',
            component:LayoutRrhhComponent,
            canActivate:[rrhhGuard],
            children:[
              {
                path:'inicio-rrhh',
                component:InicioRrhhComponent
              },
              {
                path:'solicitudes-rrhh',
                component:SolicitudesRrhhComponent
              }
            ]
          },
          {
            path:'administracion',
            component:LayoutAdministracionComponent,
            canActivate:[administracionGuard],
            children:[
              {
                path:'inicio-administracion',
                component:InicioAdministracionComponent
              },
              {
                path:'solicitudes-administracion',
                component:SolicitudesAdminsitracionComponent
              }
            ]
          },   {
            path:'internacional',
            component:LayoutInternacionalComponent,
            canActivate:[internacionalGuard],
            children:[
              {
                path:'inicio-internacional',
                component:InicioInternacionalComponent
              },
              {
                path:'solicitudes-internacional',
                component:SolicitudesInternacionalComponent
              }
            ]
          },
          {
            path:'laboratorio',
            component:LayoutLaboratorioComponent,
            canActivate:[laboratorioGuard],
            children:[
              {
                path:'inicio-laboratorio',
                component:InicioLaboratorioComponent
              },
              {
                path:'solicitudes-laboratorio',
                component:SolicitudesLaboratorioComponent
              },
              {
                path:'CrearSolicitudMuestrasLab',
                component:CrearSolicitudMuestrasLabComponent
              },
              {
                path:'ver-muestras-lab',
                component:VerSolicitudMuestrasLabComponent
              },
              {
                path:'crear-muestra-almacen',
                component:CrearSolicitudAlmacenComponent
              },
              {
                path:'ver-muestra-almacen',
                component:VerMateriasPrimasAlmacenComponent
              }

            ]
          },
          {
            path:'gerencia',
            component:LayoutGerenciaComponent,
            canActivate:[gerenciaGuard],
            children:[
              {
                path:'inicio-gerencia',
                component:InicioLaboratorioComponent
              },
              {
                path:'solicitudes-gerencia',
                component:SolicitudesGerenciaComponent
              },
              {
                path:'registro-planta',
                component:RegistroPlantaComponent
              },
              {
                path:'calendario-compartido',
                component:CalendarioFernandoCarlosComponent
              }
            ]
          },
          {
            path:'mantenimiento',
            component:LayoutMantenimientoComponent,
            canActivate:[manteniminentoGuard],
            children:[
              {
                path:'inicio-mantenimiento',
                component:InicioMantenimientoComponent
              },
              {
                path:'solicitudes-mantenimiento',
                component:SolicitudesManteniminentoComponent
              }
            ]
          },
          {
            path:'oficina-tecnica',
            component:LayoutOficinaTecnicaComponent,
            canActivate:[oficinatecGuard],
            children:[
              {
                path:'inicio-oficina-tecnica',
                component:InicioOficinaTecnicaComponent
              },
              {
                path:'solicitudes-oficina-tecnica',
                component:SolicitudesOficinaTecnicaComponent
              },
              {
                path:'muestras',
                component:CrearSolicitudMuestrasComponent
              },
              {
                path:'ver-muestras',
                component:VerSolicitudMuestrasComponent
              }

            ]
          },
          {
            path:'logistica',
            component:LayoutLogisticaComponent,
            canActivate:[logisticaGuard],
            children:[
              {
                path:'inicio-logistica',
                component:InicioLogisticaComponent
              },
              {
                path:'solicitudes-logistica',
                component:SolicitudesLogisticaComponent
              },
              {
                path:'muestras',
                component:CrearSolicitudMuestrasLogisticaComponent
              },
              {
                path:'ver-muestras',
                component:VerSolicitudMuestrasLogisticaComponent
              },
              {
                path:'muestras-almacen',
                component:SolicitudesMuestraAlmacenComponent
              }
              ,


            ]
          }
        ]

      }


];
