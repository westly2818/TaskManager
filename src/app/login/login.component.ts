import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  activeTab: any = 'login'
  constructor() { }

  ngOnInit(): void {
  }
  changeTab(tab: any) {
    this.activeTab = tab
  }

}
