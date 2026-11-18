import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ListRequest } from "../models/requests/list-request";
import { Observable } from "rxjs";
import { RoleListResponse } from "../models/responses/role-list-response";
import { RoleGetResponse } from "../models/responses/role-get-response";
import { RoleCreateResponse } from "../models/responses/role-create-response";
import { RoleCreateRequest } from "../models/requests/role-create-request";
import { RoleUpdateResponse } from "../models/responses/role-update-response";
import { RoleUpdateRequest } from "../models/requests/role-update-request";
import { RoleUpdateStatusResponse } from "../models/responses/role-update-status-response";
import { RoleUpdateStatusRequest } from "../models/requests/role-update-status-request";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

    private url = `${environment.baseUrl}/roles`
    private readonly http = inject(HttpClient);  

    public getAll(params: ListRequest):Observable<HttpResponse<RoleListResponse>>{
      return this.http.post<RoleListResponse>(`${this.url}/list`, params , { observe: 'response'});
    }

    public getId(id:number):Observable<HttpResponse<RoleGetResponse>>{
      return this.http.get<RoleGetResponse>(`${this.url}/${id}`,{ observe: 'response'});
    }

    public create(params: RoleCreateRequest):Observable<HttpResponse<RoleCreateResponse>>{
      return this.http.post<RoleCreateResponse>(`${this.url}`, params ,{ observe: 'response'});
    }

    public update(params: RoleUpdateRequest):Observable<HttpResponse<RoleUpdateResponse>>{
      return this.http.put<RoleUpdateResponse>(`${this.url}/${params.id}`, params ,{ observe: 'response'});
    }

    public updateStatus(params:RoleUpdateStatusRequest):Observable<HttpResponse<RoleUpdateStatusResponse>>{
      return this.http.put<RoleUpdateStatusResponse>(`${this.url}/${params.id}/status`, params ,{ observe: 'response'});
    }

}
