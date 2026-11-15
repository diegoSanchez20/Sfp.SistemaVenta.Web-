import { Injectable } from '@angular/core';
import { User } from '../models/responses/login-response';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  /** Guarda la sesión que devuelve la API al iniciar sesión */
  setSession(token: string, user: User): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /** Datos del usuario con sesión iniciada (id, user, permission[]) */
  getUser(): User | null {
    try {
      const user = sessionStorage.getItem(this.USER_KEY);

      return user ? (JSON.parse(user) as User) : null;
    } catch {
      return null;
    }
  }

  /** true si hay un token guardado y todavía no venció */
  isLoggedIn(): boolean {
    const token = this.getToken();

    return !!token && !this.tokenVencido(token);
  }

  logout(): void {
    sessionStorage.clear();
  }

  // El token JWT trae su fecha de vencimiento (exp, en segundos) en la parte del medio
  private tokenVencido(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      // Un token que no se puede leer no sirve
      return true;
    }
  }
}