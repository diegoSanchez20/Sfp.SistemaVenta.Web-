import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ListRequest } from "../models/requests/list-request";
import { Observable } from "rxjs";
import { PermissionListResponse } from "../models/responses/permission-list-response";
import { PermissionGetResponse } from "../models/responses/permission-get-response";
import { PermissionCreateRequest } from "../models/requests/permission-create-request";
import { PermissionCreateResponse } from "../models/responses/permission-create-response";
import { PermissionUpdateRequest } from "../models/requests/permission-update-request";
import { PermissionUpdateResponse } from "../models/responses/permission-update-response";
import { PermissionUpdateStatusRequest } from "../models/requests/permission-update-status-request";
import { PermissionUpdateStatusResponse } from "../models/responses/permission-update-status-response";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

    private url = `${environment.baseUrl}/permissions`
    private readonly http = inject(HttpClient);  

    public getAll(params: ListRequest):Observable<HttpResponse<PermissionListResponse>>{
      return this.http.post<PermissionListResponse>(`${this.url}/list`, params , { observe: 'response'});
    }

    public getId(id:number):Observable<HttpResponse<PermissionGetResponse>>{
      return this.http.get<PermissionGetResponse>(`${this.url}/${id}`,{ observe: 'response'});
    }

    public create(params: PermissionCreateRequest):Observable<HttpResponse<PermissionCreateResponse>>{
      return this.http.post<PermissionCreateResponse>(`${this.url}`, params ,{ observe: 'response'});
    }

    public update(params: PermissionUpdateRequest):Observable<HttpResponse<PermissionUpdateResponse>>{
      return this.http.put<PermissionUpdateResponse>(`${this.url}/${params.id}`, params ,{ observe: 'response'});
    }

    public updateStatus(params:PermissionUpdateStatusRequest):Observable<HttpResponse<PermissionUpdateStatusResponse>>{
      return this.http.put<PermissionUpdateStatusResponse>(`${this.url}/${params.id}/status`, params ,{ observe: 'response'});
    }

}
