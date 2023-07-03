import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from "@angular/forms";
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/services/firebase.service'
import * as moment from 'moment';
import { log } from 'console';
import * as _ from "lodash"
import { MatTooltipModule } from '@angular/material/tooltip';
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
  tableData: any = []
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

  maxDate: any = moment()
  taskFormObj: any = { 'product': '', 'projectCode': '', 'task_type': '', 'assignedBy': '', 'timeline': '' }
  selected: any
  HistorycollectionName: any = ''
  LiveCollectionName: any = ''
  disableAdd: any = false
  disableUpdate: any = false
  cardData: any = [{ title: 'Total Task', value: 0 }, { title: 'Total Completed', value: 0 }, { title: 'Task OnHold', value: 0 }, { title: ' Pending Task', value: 0 },]
  constructor(private FirebaseService: FirebaseService, private modalService: NgbModal, public fb: FormBuilder,) {
    // this.minDate.setDate(this.minDate.getDate() - 0);
  }

  ngOnInit(): void {
    let teamID = this.employeeteam.replace(/ /gi, '_').toLowerCase()

    this.HistorycollectionName = `/TaskData/${teamID}/${this.empCode}/history_data/datalake`
    this.LiveCollectionName = `/TaskData/${teamID}/${this.empCode}/live_data/datalake`
    this.myForm = new FormGroup({
      product: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      assignedBy: new FormControl('', [Validators.required]),
      timeline: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])

    });
    this.getMyTasks()

  }

  getMyTasks() {
    this.tableData = []
    let liveParam = {
      category: '',
      collectionName: this.LiveCollectionName,
      conditions: []
    }
    this.FirebaseService.getData(liveParam).subscribe((res: any) => {
      res.forEach((data: any) => {
        let myObj = data.data()
        if (myObj.status == 'In Progress') {
          this.disableAdd = true
          this.disableUpdate = false
        }
        else {
          this.disableAdd = false
          this.disableUpdate = true

        }
      })
    })
    let params = {
      category: '',
      collectionName: this.HistorycollectionName,
      conditions: []
    }
    this.FirebaseService.getData(params).subscribe((res: any) => {
      res.forEach((data: any) => {
        let myObj = data.data()


        myObj.startTime = moment(myObj.startTime.seconds * 1000).format('DD-MM-YYYY HH:mm')
        myObj.endTime = moment(myObj.endTime.seconds * 1000).format('DD-MM-YYYY HH:mm')

        myObj.timeline = moment(myObj.timeline.seconds * 1000).format('DD-MM-YYYY HH:mm')

        this.tableData.push(myObj)
      })
      this.tableData = _.orderBy(this.tableData, ['startTime'], ['desc'])
      let totalTask = this.tableData.filter((ele: any) => {
        return ele.status == 'In Progress'
      })

      let completed = this.tableData.filter((ele: any) => {
        return ele.status == 'Completed'
      })
      let onhold = this.tableData.filter((ele: any) => {
        return ele.status == 'On Hold'
      })
      let pending = this.tableData.filter((ele: any) => {
        return ele.status == 'Pending'
      })
      this.cardData[0].value = totalTask.length
      this.cardData[1].value = completed.length

      this.cardData[2].value = onhold.length

      this.cardData[3].value = pending.length

    })
  }
  assignData(data: any) {
    this.modalService.dismissAll()
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

      this.getMyTasks()

    })


  }
  async updateStatus(status: any) {

    let params = {
      category: '',
      collectionName: this.HistorycollectionName,
      conditions: [{ key: 'status', symbol: '==', value: 'In Progress' }]
    }
    await this.FirebaseService.getData(params).subscribe((res: any) => {
      res.forEach((ele: any) => {
        let data = ele.data()
        console.log(data);
        let id = ele.id
        data.status = status
        data.endTime = moment().toDate()
        let insertParam = {
          collectionName: this.HistorycollectionName,
          doc: id,
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

          this.getMyTasks()
        })
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
