export interface MenuItem {
  /** Texto que se muestra en el menú */
  label: string;
  /** Ruta absoluta a la que lleva la opción (los grupos no llevan ruta) */
  route?: string;
  /** Opciones anidadas: convierten esta opción en un grupo desplegable */
  children?: MenuItem[];
}
