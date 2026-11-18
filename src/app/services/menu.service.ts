import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ListRequest } from "../models/requests/list-request";
import { MenuListResponse } from "../models/responses/menu-list-response";
import { Observable } from "rxjs";
import { MenuGetResponse } from "../models/responses/menu-get-response";
import { MenuCreateRequest } from "../models/requests/menu-create-request";
import { MenuCreateResponse } from "../models/responses/menu-create-response";
import { MenuUpdateRequest } from "../models/requests/menu-update-request";
import { MenuUpdateResponse } from "../models/responses/menu-update-response";
import { MenuUpdateStatusRequest } from "../models/requests/menu-update-status-request";
import { MenuUpdateStatusResponse } from "../models/responses/menu-update-status-response";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    private url = `${environment.baseUrl}/menus`
    private readonly http = inject(HttpClient);  

    public getAll(params: ListRequest):Observable<HttpResponse<MenuListResponse>>{
      return this.http.post<MenuListResponse>(`${this.url}/list`, params , { observe: 'response'});
    }

    public getMenu(id:number):Observable<HttpResponse<MenuGetResponse>>{
      return this.http.get<MenuGetResponse>(`${this.url}/${id}`,{ observe: 'response'});
    }

    public create(params: MenuCreateRequest):Observable<HttpResponse<MenuCreateResponse>>{
      return this.http.post<MenuCreateResponse>(`${this.url}`, params ,{ observe: 'response'});
    }

    public update(params: MenuUpdateRequest):Observable<HttpResponse<MenuUpdateResponse>>{
      return this.http.put<MenuUpdateResponse>(`${this.url}/${params.id}`, params ,{ observe: 'response'});
    }

    public updateStatus(params:MenuUpdateStatusRequest):Observable<HttpResponse<MenuUpdateStatusResponse>>{
      return this.http.put<MenuUpdateStatusResponse>(`${this.url}/${params.id}/status`, params ,{ observe: 'response'});
    }

}
