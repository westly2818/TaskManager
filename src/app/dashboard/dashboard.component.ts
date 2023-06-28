import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from "@angular/forms";
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/services/firebase.service'
import * as moment from 'moment';
import { log } from 'console';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  nameOFemployee: any = 'Westly David'
  employeeteam: any = 'Product Development'
  empCode: any = 'BLPCE224'
  branch: any = 'TrustAi'
  prods: any = ['TrustAi', 'PredictAi', 'ConserveAi']
  totaldata = [
    'BLPHULDD99000', 'BLPVECV74939', 'BLPDDCR472900'
  ];
  statusData: any = ['On Hold', 'Completed', 'Pending', 'Cancel']
  ProjectCodes = [
    'BLPHULDD99000', 'BLPVECV74939', 'BLPDDCR472900'];
  devType: any = ['Bug Fixing', 'Development', 'Internal Requirement']
  leads: any = ['Sam', 'Venkatesh']
  filterdData: any = []
  myForm: any = []

  obj: any = {
    'name': '',
    'team': '',
    'branch': '',
    'organization': 'BLP',
    'product': '',
    'projectCode': '',
    'taskType': '',
    'status': '',
    'assignedBy': '',
    'description': '',
    'startTime': '',
    'timeline': '',
    'endTime': ''
  }
  taskFormObj: any = { 'product': '', 'projectCode': '', 'task_type': '', 'assignedBy': '', 'timeline': '' }
  selected: any
  HistorycollectionName: any = ''
  LiveCollectionName: any = ''
  constructor(private FirebaseService: FirebaseService, private modalService: NgbModal, public fb: FormBuilder,) { }

  ngOnInit(): void {
    let teamID = this.employeeteam.replace(/ /gi, '_').toLowerCase()
    console.log(teamID);

    this.HistorycollectionName = `/TaskData/${teamID}/${this.empCode}/history_data/datalake`
    this.LiveCollectionName = `/TaskData/${teamID}/${this.empCode}/live_data/datalake`
    this.myForm = new FormGroup({
      product: new FormControl(''),
      code: new FormControl(''),
      type: new FormControl(''),
      assignedBy: new FormControl(''),
      timeline: new FormControl(''),
      description: new FormControl('')

    });


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
  assignData(data: any) {
    let date = moment(data.value.timeline.startDate.$d).subtract(330, 'minute').toDate()


    this.obj.branch = this.branch
    this.obj.team = this.employeeteam
    this.obj.name = this.nameOFemployee
    this.obj.product = data.value.product
    this.obj.taskType = data.value.type
    this.obj.projectCode = data.value.code
    this.obj.description = data.value.description
    this.obj.timeline = date
    this.obj.assignedBy = data.value.assignedBy
    this.obj.startTime = moment().toDate()
    this.obj.endTime = moment().toDate()
    this.obj.status = 'In Progress'
    let insertParam = {
      collectionName: this.HistorycollectionName,
      data: this.obj
    }
    let updateLive = {
      collectionName: this.LiveCollectionName,
      doc: this.nameOFemployee,
      data: this.obj
    }
    this.FirebaseService.insertData(insertParam).then((res: any) => {
      console.log('done insertion history');

    })
    this.FirebaseService.insertData(updateLive).then((res: any) => {
      console.log('done updated live');

    })

    console.log(this.obj);

  }
  updateStatus(status: any) {
    let params = {
      category: '',
      collectionName: this.LiveCollectionName,
      conditions: []
    }
    this.FirebaseService.getData(params).subscribe((res: any) => {
      res.forEach((ele: any) => {
        let data = ele.data()
        console.log(data);
        if (data.status != 'In Progress') {

        }
        else {
          data.status = status
          data.endTime = moment().toDate()
          let insertParam = {
            collectionName: this.HistorycollectionName,
            data: data
          }
          let updateLive = {
            collectionName: this.LiveCollectionName,
            doc: this.nameOFemployee,
            data: data
          }
          this.FirebaseService.insertData(insertParam).then((res: any) => {
            console.log('done insertion history');

          })
          this.FirebaseService.insertData(updateLive).then((res: any) => {
            console.log('done updated live');

          })
        }
      })


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
      this.ProjectCodes = filter
    }
    else {
      this.ProjectCodes = this.totaldata
    }

  }
}
