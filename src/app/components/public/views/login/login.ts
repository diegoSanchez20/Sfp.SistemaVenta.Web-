import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MsgValidators } from '../../../../utils/msgValidators';
import { REGEX_SOLO_NUMEROS } from '../../../../constants/main_constants';
import { GeneralInput } from '../../../../shared/general-input/general-input';
import { LoginRequest } from '../../../../models/requests/login-request';
import { LoginService } from '../../../../services/login.service';
import { AuthService } from '../../../../services/auth.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    GeneralInput
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly verPassword = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    user: ['', [Validators.required, Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(8),Validators.pattern(REGEX_SOLO_NUMEROS)]],
  });

  get passwordErrorMsg():string{
    return MsgValidators.msgErrorPassword(this.form,'password');
  }

  public errorMessages = {
    usuario:"El usuario es obligatorio",
  }

  campoEsValido(){
    return this.form.invalid && this.form.touched;
  }
  
  onClick = {
    iniciarSesion: async() => {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      
      let params: LoginRequest = {
        user: this.form.value.user ?? '',
        password: this.form.value.password ?? ''
      }

      let response = await this.services.login(params);


      if(response.status === 200 && response.body){
        const { access_token, user } = response.body.data;
        this.auth.setSession(access_token, user);
        await this.router.navigate(['/private'], { replaceUrl: true });
      }

    }

  }

  services = {
    login: (params: LoginRequest) => {
      return lastValueFrom(this.loginService.iniciarSesion(params));
    }
  }
}
