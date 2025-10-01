import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone:false
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      ]],
      confirm: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check password match
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirm = form.get('confirm');
    
    return password && confirm && password.value !== confirm.value 
      ? { passwordsMismatch: true } 
      : null;
  }

  registerSubmit() {
    // Mark all fields as touched to trigger validation display
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      console.log('Form is valid. Submitting...', this.registerForm.value);
      this.authService.registerUser(this.registerForm.value).subscribe(
        (res) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Error: No token received in response');
          }
        },
        (error) => {
          console.error('Registration failed:', error);
          // Consider adding user-friendly error handling
          // For example, display error message on the form
        }
      );
    } else {
      console.error('Form is invalid', this.registerForm.errors);
      this.printErrors(); // Log specific validation errors
    }
  }
  printErrors() {
    const controls = this.registerForm.controls;
    // am I accessing / trying to get controlelrs array

    for (const controllerName in controls) {
      const control = controls[controllerName];
      if (control.invalid && control.touched) {
        const errors = control.errors;
        if (errors) {
          console.log(`${controllerName} has the following errors:`);
          for (const error in errors) {
            console.log(`- ${error}: ${JSON.stringify(errors[error])}`);
          }
        }
      }
    }
  }

}