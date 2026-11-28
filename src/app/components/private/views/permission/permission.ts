import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SectionFormCrud } from '../../../../shared/section-form-crud/section-form-crud';
import { SectionContentCrud } from '../../../../shared/section-content-crud/section-content-crud';
import { SectionItemCrud } from '../../../../shared/section-item-crud/section-item-crud';
import { BadgeStatus } from '../../../../shared/badge-status/badge-status';
import { Pagination as PaginationComponent } from '../../../../shared/pagination/pagination';
import { GeneralInput } from '../../../../shared/general-input/general-input';
import { GeneralButton } from '../../../../shared/general-button/general-button';
import { FormBuilder, Validators } from '@angular/forms';
import { PermissionService } from '../../../../services/permission.service';
import { ListRequest } from '../../../../models/requests/list-request';
import { PermissionListItemReponse } from '../../../../models/responses/permission-list-response';
import { Pagination } from '../../../../models/pagination';
import { lastValueFrom } from 'rxjs';
import { PermissionCreateRequest } from '../../../../models/requests/permission-create-request';
import { PermissionUpdateRequest } from '../../../../models/requests/permission-update-request';
import { PermissionUpdateStatusRequest } from '../../../../models/requests/permission-update-status-request';
import Swal from 'sweetalert2';
import { MenuService } from '../../../../services/menu.service';
import { GeneralSelect } from '../../../../shared/general-select/general-select';
import { SelectOption } from '../../../../models/responses/select-option';

@Component({
  selector: 'app-permission',
  imports: [
    MatIconModule,
    SectionFormCrud,
    SectionContentCrud,
    SectionItemCrud,
    BadgeStatus,
    PaginationComponent,
    GeneralInput,
    GeneralSelect,
    GeneralButton
  ],
  templateUrl: './permission.html',
  styleUrl: './permission.scss',
})
export class Permission{

  private readonly fb = inject(FormBuilder);
  private readonly permissionService = inject(PermissionService);
  private readonly menuService = inject(MenuService);

  private readonly pageSize = 15;
  private listaRequest: ListRequest = { per_page: this.pageSize, page: 1, search: '' };
  protected readonly permissions = signal<PermissionListItemReponse[]>([]);
  protected readonly menusCombo = signal<SelectOption[]>([]);
  protected readonly cargado = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    id: [''],
    name: ['', Validators.required],
    slug: ['', Validators.required],
    grupo: ['', Validators.required],
    menu_id: [''],
  });

  protected readonly formSearch = this.fb.nonNullable.group({
    name: [''],
  });

  protected readonly pagination = signal<Pagination>({
    totalRows: 0,
    pagesTotal: 0,
    pagesActual: 1,
    onChangePage: (pagesActual: number) => this.onClick.cambiarPagina(pagesActual),
  });

  protected readonly errorMessages = {
    name:"El nombre es obligatorio",
    slug:"El slug es obligatorio",
    grupo:"El grupo es obligatorio",
  }

  ngOnInit(): void{
    this.setDataSearch();
    void this.loadData();
    void this.loadMenuCombo();
  }

  private setDataSearch(): void {
    this.listaRequest = {
      search: this.formSearch.getRawValue().name.trim(),
      page: this.pagination().pagesActual,
      per_page: this.pageSize,
    };
  }

  campoEsValido(){
    return this.form.invalid && this.form.touched;
  }

  private async loadData(): Promise<void> {
    try {
      const response = await this.service.getAll();

      if (response.status === 200 && response.body) {
        this.permissions.set(response.body.data);
        this.pagination.update((p) => ({
          ...p,
          totalRows: response.body!.meta.total,
          pagesTotal: response.body!.meta.last_page,
          pagesActual: response.body!.meta.current_page,
        }));
      }
    } finally {
      this.cargado.set(true);
    }
  }

  private async loadMenuCombo(): Promise<void> {
  
    const response = await this.service.getComboMenu();

    if (response.status === 200 && response.body) {
      this.menusCombo.set(response.body.data);
    }
   
  }

  protected readonly onClick = {
    cambiarPagina: (pagesActual: number) => {
      this.pagination.update((p) => ({ ...p, pagesActual }));
      this.listaRequest.page = pagesActual;
      void this.loadData();
    },
    guardar: async() => {
      if(this.form.invalid){
        this.form.markAllAsTouched();
        return;
      }

      const {id, name, grupo, slug, menu_id} = this.form.getRawValue();

      if(id == ''){
        // registrar
        let params: PermissionCreateRequest = { name, grupo, slug, menu_id }
        
        const response = await this.service.create(params);
        if(response.status == 201){
          Swal.fire({
            icon:'success',
            html: `El menú <strong>${ params.name }</strong> se creó correctamente`,
          })
        }
      }else{
        // editar
        let params: PermissionUpdateRequest = { id, name, grupo, slug, menu_id}
        
        const response = await this.service.update(params);
        if(response.status == 200){
          Swal.fire({
            icon: 'success',
            html: `El menú <strong>${ params.name }</strong> se editó correctamente`,
          });
        }
      }

      this.onClick.cancelar();
      this.loadData();
    },
    actualizarEstado: async(item: PermissionListItemReponse) => {
          
      const {id, status, name} = item;

      let params: PermissionUpdateStatusRequest = { id, status: !status }

      const response = await this.service.updateStatus(params);

      if(response.status == 200){
        Swal.fire({
          icon: 'success',
          html: `El permiso <strong>${ name }</strong> se ${ status ? 'deshabilitó' : 'habilitó' } correctamente`,
        });
        
        this.onClick.cancelar();
        this.loadData();
      }
    },
    cancelar: () => {
      // Al volver a "crear", el id deja de ser obligatorio
      this.form.controls.id.removeValidators(Validators.required);
      this.form.controls.id.updateValueAndValidity();
      this.form.reset();
    },
    getPermission: async (id: number) => {
      const response = await this.service.getPermission(id);

      if (response.status === 200 && response.body) {
        const permission = response.body.data;

        this.form.controls.id.addValidators(Validators.required);
        this.form.controls.id.updateValueAndValidity();

        this.form.patchValue({
          id: String(permission.id),
          name: permission.name,
          grupo: permission.grupo,
          slug: permission.slug,
          menu_id: permission.menu_id === null ? '' : String(permission.menu_id)
        });
      }
    },
    buscar: async () => {
      this.pagination.update((p) => ({ ...p, pagesActual: 1 }));
      this.setDataSearch();
      await this.loadData();
    },
    cancelarBusqueda: async () => {
      this.formSearch.reset();
      await this.onClick.buscar();
    },
  }

  private readonly service = {
    getAll: () => lastValueFrom(this.permissionService.getAll(this.listaRequest)),
    getComboMenu: () => lastValueFrom(this.menuService.comboMenu()),
    getPermission: (id:number) => lastValueFrom(this.permissionService.getId(id)),
    create: (params: PermissionCreateRequest) => lastValueFrom(this.permissionService.create(params)),
    update: (params: PermissionUpdateRequest) => lastValueFrom(this.permissionService.update(params)),
    updateStatus: (params: PermissionUpdateStatusRequest) => lastValueFrom(this.permissionService.updateStatus(params))
  };
}
