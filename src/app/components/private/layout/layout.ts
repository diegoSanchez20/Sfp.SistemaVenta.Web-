import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MenuItem } from '../../../constants/menu.constants';
import { Permission } from '../../../models/responses/login-response';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTreeModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Menú armado con los permisos que vienen de la BD:
  // 1er nivel = menú (menu_name), 2do nivel = permisos con menu_id (pantallas), la ruta sale del slug
  protected readonly menu: MenuItem[] = this.construirMenu(this.auth.getUser()?.permission ?? []);

  // Cómo encontrar los hijos de una opción (lo usa mat-tree)
  protected readonly hijos = (item: MenuItem): MenuItem[] => item.children ?? [];

  // true cuando la opción es un grupo desplegable
  protected readonly tieneHijos = (_: number, item: MenuItem): boolean => !!item.children?.length;

  protected cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private construirMenu(permisos: Permission[]): MenuItem[] {
    const grupos = new Map<number, MenuItem>();

    for (const permiso of permisos) {
      // Los permisos sin menu_id son acciones (crear, editar...), no pantallas
      if (permiso.menu_id === null) continue;

      let grupo = grupos.get(permiso.menu_id);
      if (!grupo) {
        grupo = { label: permiso.menu_name ?? '', children: [] };
        grupos.set(permiso.menu_id, grupo);
      }
      grupo.children!.push({ label: permiso.name, route: `/private/${permiso.slug}` });
    }

    return [...grupos.values()];
  }
}
