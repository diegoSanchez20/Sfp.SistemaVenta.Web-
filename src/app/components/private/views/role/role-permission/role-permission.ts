import { Component, computed, inject, signal } from '@angular/core';
import { SectionContentCrud } from '../../../../../shared/section-content-crud/section-content-crud';
import { RoleService } from '../../../../../services/role.service';
import { PermissionService } from '../../../../../services/permission.service';
import { lastValueFrom } from 'rxjs';
import { RolePermissionAsignarListarRequest } from '../../../../../models/requests/role-permission-assign-list-request';
import { RolePermissionAssignRequest } from '../../../../../models/requests/role-permission-assign-request';
import { ActivatedRoute } from '@angular/router';
import { GeneralInput } from '../../../../../shared/general-input/general-input';
import { GeneralButton } from '../../../../../shared/general-button/general-button';
import { FormBuilder } from '@angular/forms';
import { RolePermissionAssignListItemReponse } from '../../../../../models/responses/role-permission-assign-list-response';
import { SectionItemCrud } from '../../../../../shared/section-item-crud/section-item-crud';
import { GeneralSwitch } from '../../../../../shared/general-switch/general-switch';
import { AppGeneralFailledButton } from '../../../../../shared/app-general-failled-button/app-general-failled-button';

@Component({
  selector: 'app-role-permission',
  imports: [
    SectionContentCrud,
    GeneralInput,
    GeneralButton,
    GeneralSwitch,
    SectionItemCrud,
    AppGeneralFailledButton
  ],
  templateUrl: './role-permission.html',
  styleUrl: './role-permission.scss',
})
export class RolePermission {

  private readonly fb = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly permissionService = inject(PermissionService);
  private readonly route = inject(ActivatedRoute);
  protected readonly cargado = signal(false);
  protected readonly permissions = signal<RolePermissionAssignListItemReponse[]>([]);
  rol_id = signal(0);
  rol_name = signal('');
  protected readonly formSearch = this.fb.nonNullable.group({
    name: [''],
  });

  ngOnInit(): void {
    this.rol_id.set(Number(this.route.snapshot.paramMap.get('id')));
    this.onInit.getRol();
    this.onInit.loadData();
  }

  // Un permiso por grupo (el que tiene menú) para pintar una tarjeta por grupo, sin repetirla
  protected readonly encabezados = computed(() => {
    const porGrupo = new Map<number, RolePermissionAssignListItemReponse>();

    for (const item of this.permissions()) {
      if (item.menu_id != null && !porGrupo.has(item.grupo)) {
        porGrupo.set(item.grupo, item);
      }
    }
    console.log(porGrupo);
    return [...porGrupo.values()];
  });

  // Permisos de un grupo (incluye al del encabezado)
  protected opcionesDelGrupo(grupo: number): RolePermissionAssignListItemReponse[] {
    return this.permissions().filter((item) => item.grupo === grupo);
  }

  // true si todos los permisos del grupo están asignados
  protected todosSeleccionados(grupo: number): boolean {
    const opciones = this.opcionesDelGrupo(grupo);

    return opciones.length > 0 && opciones.every((item) => item.assigned);
  }

  // Texto "seleccionados/total" de un grupo, ej. "3/5"
  protected totalOpcionesSeleccionadas(grupo: number): string {
    const opciones = this.opcionesDelGrupo(grupo);
    const seleccionados = opciones.filter((item) => item.assigned).length;

    return `${seleccionados}/${opciones.length}`;
  }

  onInit = {
    getRol:async() => {
      let response = await this.service.getRole(this.rol_id());
      if(response.status == 200){
        console.log(response.body)
        this.rol_name.set(response.body?.data.name ?? '');
      }
    },
    loadData:async() => {
      try {

        let params: RolePermissionAsignarListarRequest = {
          role_id: this.rol_id(),
          search: this.formSearch.getRawValue().name.trim()
        }
        const response = await this.service.getAllPermissionActive(params);

        if (response.status === 200 && response.body) {
          this.permissions.set(response.body.data);
        }
      } finally {
        this.cargado.set(true);
      }
    }
  }

  onClick = {
    buscar: async () => {

    },
    cancelarBusqueda: async () => {

    },
    // Si todo el grupo está marcado lo quita todo; en cualquier otro caso lo marca todo
    marcarQuitarTodos: (grupo: number) => {
      const asignar = !this.todosSeleccionados(grupo);

      this.permissions.update((lista) =>
        lista.map((item) => (item.grupo === grupo ? { ...item, assigned: asignar } : item))
      );
    },
    // Actualiza el estado local al mover un switch (así el contador del grupo se recalcula)
    cambiarAsignacion: (id: number, assigned: boolean) => {
      this.permissions.update((lista) =>
        lista.map((item) => (item.id === id ? { ...item, assigned } : item))
      );
    }
  }

  private service = {
    getRole: (id:number) => lastValueFrom(this.roleService.getId(id)),
    getAllPermissionActive: (params: RolePermissionAsignarListarRequest) => lastValueFrom(this.permissionService.getAllPermissionActive(params)),
    assignRolePermission: (params: RolePermissionAssignRequest, role_id: number) => lastValueFrom(this.roleService.assignRolePermission(params, role_id)),
  }
}
