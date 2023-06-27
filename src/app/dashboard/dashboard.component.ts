import { Component, OnInit } from '@angular/core';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/services/firebase.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  nameOFemployee: any = 'Westly David'
  employeeteam: any = 'Product Development'
  myForm: any = []
  prods: any = ['TrustAi', 'PredictAi', 'ConserveAi']
  totaldata = [
    'BLPHULDD99000', 'BLPVECV74939', 'BLPDDCR472900'
  ];
  ProjectCodes = [
    'BLPHULDD99000', 'BLPVECV74939', , 'BLPDDCR472900'];
  devType: any = ['Bug Fixing', 'Development', 'Internal Requirement']
  leads: any = ['sam', 'venkatesh']
  filterdData: any = []

  obj = {
    'name': 'wesy',
    'employeeCode': 'BLPCE224',
    'team': 'Product Development',
    'branch': 'TrustAi',
    'organization': 'BLP',
    'product': '',
    'projectCode': '',
    'taskType': '',
    'status': '',
    'assignedBy': '',
    'description': '',
    'position': 'employee',
    'startTime': '',
    'timeline': '',
    'endTime': ''
  }
  taskFormObj: any = { 'product': '', 'projectCode': '', 'task_type': '', 'assignedBy': '', 'timeline': '' }
  constructor(private FirebaseService: FirebaseService, private modalService: NgbModal,) { }

  ngOnInit(): void {



  }

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
  assignData(data: any, from: any) {
    console.log(data);

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
      this.ProjectCodes = filter
    }
    else {
      this.ProjectCodes = this.totaldata
    }

  }
}
