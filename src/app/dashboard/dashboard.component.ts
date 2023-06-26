import { Component, OnInit } from '@angular/core';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/services/firebase.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myForm: any = []
  prods: any = ['TrustAi', 'PredictAi', 'ConserveAi']
  totaldata = [
    'wesy', 'vishnu', 'vibush', 'maha'
  ];
  foods = [
    'wesy', 'vishnu', 'vibush', 'maha'
  ];
  devType: any = ['Bug Fixing', 'Development', 'Internal Requirement']
  leads: any = ['sam', 'venkatesh']
  filterdData: any = []
  constructor(private FirebaseService: FirebaseService, private modalService: NgbModal,) { }

  ngOnInit(): void {



  }
  // add (newValue: string): void {
  //   newValue = newValue.trim();
  //   if(!newValue) {return;}
  //   this.foods.push({value: '','viewValue':newValue});
  // }
  getdoc() {
    let params = {
      category: '',
      collectionName: 'checkdata',
      conditions: []
    }
    this.FirebaseService.getData(params).subscribe((res: any) => {
      console.log(res);

    })
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(

    );
  }

  onInputChange(changes: any) {
    let filter = this.totaldata.filter(ele => {
      return ele.startsWith(changes)
    })
    if (filter.length > 0) {
      this.foods = filter
    }
    else {
      this.foods = this.totaldata
    }

  }
}
