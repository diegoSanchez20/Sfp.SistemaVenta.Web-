import { FormGroup } from '@angular/forms';

export abstract class MsgValidators{
    
    static msgErrorPassword(formControl:FormGroup, control: string) {

        const errors = formControl.get(control)?.errors;

        if(errors?.['required']) return 'La contraseña es obligatoria.'
        else if(errors?.['pattern']) return 'Ingresar solo números.'
        else if(errors?.['minlength']) return 'La contraseña debe tener 8 dígitos.'
        else if(errors?.['maxlength']) return 'El contraseña debe tener 8 dígitos.'
        return '';

    };
}