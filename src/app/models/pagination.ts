export interface Pagination{
    totalRows:number,
    pagesTotal:number,
    pagesActual:number,
    onChangePage:(page:number) => void
}
