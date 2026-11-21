import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '../../../../services/role.service';
import { ListRequest } from '../../../../models/requests/list-request';
import { RoleListItemReponse } from '../../../../models/responses/role-list-response';
import { Pagination as PaginationComponent } from '../../../../shared/pagination/pagination';
import { Pagination } from '../../../../models/pagination';
import { lastValueFrom } from 'rxjs';
import { RoleCreateRequest } from '../../../../models/requests/role-create-request';
import Swal from 'sweetalert2';
import { RoleUpdateRequest } from '../../../../models/requests/role-update-request';
import { RoleUpdateStatusRequest } from '../../../../models/requests/role-update-status-request';
import { MatIconModule } from '@angular/material/icon';
import { SectionFormCrud } from '../../../../shared/section-form-crud/section-form-crud';
import { SectionContentCrud } from '../../../../shared/section-content-crud/section-content-crud';
import { SectionItemCrud } from '../../../../shared/section-item-crud/section-item-crud';
import { BadgeStatus } from '../../../../shared/badge-status/badge-status';
import { GeneralInput } from '../../../../shared/general-input/general-input';
import { GeneralButton } from '../../../../shared/general-button/general-button';

@Component({
  selector: 'app-role',
  imports: [
    MatIconModule,
    SectionFormCrud,
    SectionContentCrud,
    SectionItemCrud,
    BadgeStatus,
    PaginationComponent,
    GeneralInput,
    GeneralButton
  ],
  templateUrl: './role.html',
  styleUrl: './role.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Role {

  private readonly fb = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly pageSize = 15;
  private listaRequest: ListRequest = { 
    per_page: this.pageSize, 
    page: 1, 
    search: '' 
  };
  protected readonly roles = signal<RoleListItemReponse[]>([]);
  protected readonly cargado = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    id: [''],
    name: ['', Validators.required],
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
  }

  ngOnInit(): void {
    this.setDataSearch();
    void this.loadData();
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

  private async loadData(): Promise<void>{
    try {
      const response = await this.service.getAll();

      if (response.status === 200 && response.body) {
        this.roles.set(response.body.data);
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

      const {id, name} = this.form.getRawValue();

      if(id == ''){
        // registrar
        let params: RoleCreateRequest = { name }
        
        const response = await this.service.create(params);
        if(response.status == 201){
          Swal.fire({
            icon:'success',
            html: `El rol <strong>${ params.name }</strong> se creó correctamente`,
          })
        }
      }else{
        // editar
        let params: RoleUpdateRequest = { id, name}
        
        const response = await this.service.update(params);
        if(response.status == 200){
          Swal.fire({
            icon: 'success',
            html: `El rol <strong>${ params.name }</strong> se editó correctamente`,
          });
        }
      }

      this.onClick.cancelar();
      this.loadData();
    },
    actualizarEstado: async(item: RoleListItemReponse) => {
          
      const {id, status, name} = item;

      let params: RoleUpdateStatusRequest = { id, status: !status }

      const response = await this.service.updateStatus(params);

      if(response.status == 200){
        Swal.fire({
          icon: 'success',
          html: `El rol <strong>${ name }</strong> se ${ status ? 'deshabilitó' : 'habilitó' } correctamente`,
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
    getRole: async (id: number) => {
      const response = await this.service.getRole(id);

      if (response.status === 200 && response.body) {
        const role = response.body.data;

        this.form.controls.id.addValidators(Validators.required);
        this.form.controls.id.updateValueAndValidity();

        this.form.patchValue({
          id: String(role.id),
          name: role.name,
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
    getAll: () => lastValueFrom(this.roleService.getAll(this.listaRequest)),
    getRole: (id:number) => lastValueFrom(this.roleService.getId(id)),
    create: (params: RoleCreateRequest) => lastValueFrom(this.roleService.create(params)),
    update: (params: RoleUpdateRequest) => lastValueFrom(this.roleService.update(params)),
    updateStatus: (params: RoleUpdateStatusRequest) => lastValueFrom(this.roleService.updateStatus(params))
  }

}
