import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { SectionFormCrud } from '../../../../shared/section-form-crud/section-form-crud';
import { SectionContentCrud } from '../../../../shared/section-content-crud/section-content-crud';
import { SectionItemCrud } from '../../../../shared/section-item-crud/section-item-crud';
import { BadgeStatus } from '../../../../shared/badge-status/badge-status';
import { Pagination as PaginationComponent } from '../../../../shared/pagination/pagination';
import { ListRequest } from '../../../../models/requests/list-request';
import { MenuListItemReponse } from '../../../../models/responses/menu-list-response';
import { Pagination } from '../../../../models/pagination';
import { MenuService } from '../../../../services/menu.service';
import { GeneralInput } from '../../../../shared/general-input/general-input';
import { GeneralButton } from '../../../../shared/general-button/general-button';
import { MenuCreateRequest } from '../../../../models/requests/menu-create-request';
import { MenuUpdateRequest } from '../../../../models/requests/menu-update-request';
import { MenuUpdateStatusRequest } from '../../../../models/requests/menu-update-status-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
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
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly menuService = inject(MenuService);

  private readonly pageSize = 15;
  private listaRequest: ListRequest = { per_page: this.pageSize, page: 1, search: '' };

  // protected readonly statusCreateEdit = signal(false);
  protected readonly menus = signal<MenuListItemReponse[]>([]);
  // false hasta que termina la primera carga; evita mostrar "No se encontraron datos" mientras se espera la API
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

  // Arma la petición del listado con el texto del buscador y la página actual
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
        this.menus.set(response.body.data);
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
        let params: MenuCreateRequest = { name }
        
        const response = await this.service.create(params);
        if(response.status == 201){
          Swal.fire({
            icon:'success',
            html: `El menú <strong>${ params.name }</strong> se creó correctamente`,
          })
        }
      }else{
        // editar
        let params: MenuUpdateRequest = { id, name}
        
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
    actualizarEstado: async(item: MenuListItemReponse) => {
      
      const {id, status, name} = item;

      let params: MenuUpdateStatusRequest = { id, status: !status }

      const response = await this.service.updateStatus(params);

      if(response.status == 200){
        Swal.fire({
          icon: 'success',
          html: `El menú <strong>${ name }</strong> se ${ status ? 'deshabilitó' : 'habilitó' } correctamente`,
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
    getMenu: async (id: number) => {
      const response = await this.service.getMenu(id);

      if (response.status === 200 && response.body) {
        const menu = response.body.data;

        this.form.controls.id.addValidators(Validators.required);
        this.form.controls.id.updateValueAndValidity();

        this.form.patchValue({
          id: String(menu.id),
          name: menu.name,
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
  };


  private readonly service = {
    getAll: () => lastValueFrom(this.menuService.getAll(this.listaRequest)),
    getMenu: (id:number) => lastValueFrom(this.menuService.getId(id)),
    create: (params: MenuCreateRequest) => lastValueFrom(this.menuService.create(params)),
    update: (params: MenuUpdateRequest) => lastValueFrom(this.menuService.update(params)),
    updateStatus: (params: MenuUpdateStatusRequest) => lastValueFrom(this.menuService.updateStatus(params))
  };
}
