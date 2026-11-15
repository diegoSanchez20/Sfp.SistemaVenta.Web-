import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/requests/login-request';
import { LoginResponse } from '../models/responses/login-response';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = `${environment.baseUrl}/login`
  
  private readonly http = inject(HttpClient);

  public iniciarSesion(params: LoginRequest):Observable<HttpResponse<LoginResponse>>{
    return this.http.post<LoginResponse>(`${this.url}`,params,{observe:'response'});
  }

}
