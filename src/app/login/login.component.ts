import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  activeTab: any = 'login'
  org: any = ['BLP']
  teams: any = ['Product Development', 'Edge', 'QA', 'Visual Analytics', 'IOT', 'BD', 'Data Analytics']
  newuserForm: any = []
  loginform: any = []
  constructor(private FirebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    this.newuserForm = new FormGroup({
      team: new FormControl('', [Validators.required]),
      organization: new FormControl('', [Validators.required]),
      mailid: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required]),
      empCode: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required]),
    });
    this.loginform = new FormGroup({
      id: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }
  changeTab(tab: any) {
    this.activeTab = tab
  }
  passwordMatchValidator(control: any) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmpassword').value;

    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }
  saveuser(data: any) {
    console.log(data);

    let userobj = {
      team: data.value.team,
      name: data.value.name,
      mailid: data.value.mailid,
      password: data.value.password,
      organization: data.value.organization,
      contact: data.value.contact,
      employeeCode: data.value.empCode,
      role: 'Employee'
    }
    let userparam = {
      category: '',
      collectionName: 'users',
      conditions: [{ key: 'mailid', symbol: '==', value: userobj.mailid }]
    }
    this.FirebaseService.getData(userparam).subscribe((res: any) => {
      if (res.size > 0) {

      }
      else {
        let inserUser = {
          collectionName: 'users',
          data: userobj,
          conditions: []

        }
        this.FirebaseService.insertData(inserUser).then((res: any) => {
          console.log('done insertion users');

        })
      }
    })
  }
  checkuser(form: any) {
    let userobj = { mailid: form.value.id, pass: form.value.password }
    let userparam = {
      category: '',
      collectionName: 'users',
      conditions: [{ key: 'mailid', symbol: '==', value: userobj.mailid }]
    }
    this.FirebaseService.getData(userparam).subscribe((res: any) => {
      if (res.size > 0) {
        res.forEach((element: any) => {
          let obj = element.data()
          if (obj.password == userobj.pass) {
            console.log('user there', obj);
            localStorage.setItem('name', obj.name);
            localStorage.setItem('mailid', obj.mailid);
            localStorage.setItem('team', obj.team);
            localStorage.setItem('employeeCode', obj.employeeCode);

            this.router.navigate(['/dashboard'])
          }


        });

      }
      else {

      }
    })
  }

}
