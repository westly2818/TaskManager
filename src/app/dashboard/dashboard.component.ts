import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from "@angular/forms";
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/services/firebase.service'
import * as moment from 'moment';
import { log } from 'console';
import * as _ from "lodash"
import { MatTooltipModule } from '@angular/material/tooltip';
import * as ExcelJS from 'exceljs';
import { report } from 'process';
import { end } from '@popperjs/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  nameOFemployee: any = localStorage.getItem('name') || "";
  employeeteam: any = localStorage.getItem('team') || "";
  empCode: any = localStorage.getItem('employeeCode') || "";
  empmail: any = localStorage.getItem('mailid') || "";
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
    'employeeCode': this.empCode,
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
  selectedDateQuery: any
  HistorycollectionName: any = ''
  LiveCollectionName: any = ''
  disableAdd: any = false
  disableUpdate: any = false
  cardData: any = [{ title: 'Total Task', value: 0 }, { title: 'Total Completed', value: 0 }, { title: 'Task OnHold', value: 0 }, { title: ' Pending Task', value: 0 },]
  startDate: any = moment().subtract(7, 'days').toDate()
  endDate: any = moment().toDate()
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
  dateselected(event: any) {
    console.log(moment(event.startDate.$d).subtract(330, 'minute').toDate());
    console.log(moment(event.endDate.$d).subtract(330, 'minute').toDate());
    this.startDate = moment(event.startDate.$d).subtract(330, 'minute').toDate()
    this.endDate = moment(event.endDate.$d).subtract(330, 'minute').toDate()
    this.getMyTasks()
  }
  async getMyTasks() {
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
      conditions: [{
        key: "startTime",
        symbol: ">=",
        value: moment(this.startDate).toDate(),
      },
      {
        key: "startTime",
        symbol: "<=",
        value: moment(this.endDate).toDate(),
      },],
      orderBy: 'startTime'
    }
    await this.FirebaseService.getData(params).subscribe((res: any) => {
      res.forEach((data: any) => {
        let myObj = data.data()

        // myObj['orderTime'] = moment(myObj.startTime.seconds * 1000).toDate()
        myObj.startTime = moment(myObj.startTime.seconds * 1000).format('DD-MM-YYYY HH:mm')
        myObj.endTime = moment(myObj.endTime.seconds * 1000).format('DD-MM-YYYY HH:mm')

        myObj.timeline = moment(myObj.timeline.seconds * 1000).format('DD-MM-YYYY HH:mm')

        this.tableData.push(myObj)
      })
      // this.tableData = _.orderBy(this.tableData, ['orderTime'], ['desc'])
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
  async assignData(data: any) {
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
    this.FirebaseService.insertData(updateLive).then(async (res: any) => {
      console.log('done updated live');

      await this.getMyTasks()

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
  async downloadreport() {
    let exceldata: any = []
    for (let ele of this.tableData) {
      let reportObj: any = {}

      let currentDate: any = moment(ele.startTime, "DD-MM-YYYY HH:mm").toDate();
      let startDate: any = new Date(currentDate.getFullYear(), 0, 1);
      var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));

      var weekNumber = Math.ceil(days / 7);
      reportObj['employeeCode'] = ele.employeeCode
      reportObj['week'] = weekNumber
      reportObj['name'] = ele.name
      reportObj['team'] = ele.team
      reportObj['projectCode'] = ele.projectCode
      reportObj['hours'] = 8
      reportObj['total hours'] = 40
      exceldata.push(reportObj)
    }
    let groupByweek = _.groupBy(exceldata, ele => {
      return ele.week
    })

    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));


    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Sheet 1');


    let headers = ['Employee Code', 'Week', 'Name', 'Team', 'Project Code', 'Hours Spent', 'Total Hours']
    let headLen = headers.length
    worksheet.columns = []
    let loop = [1, 2]
    let i = 0

    let weekCount = 0
    for (let weeks in groupByweek) {

      headers.forEach((element, index) => {
        if (i == 1 || i == 0) {
          worksheet.getColumn(alphabet[i]).width = 15
        }
        else {
          worksheet.getColumn(alphabet[i]).width = 25
        }

        let headerCell = worksheet.getCell(alphabet[i] + '1')

        headerCell.value = element
        headerCell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        }
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '23395d' }
        };
        headerCell.font = { color: { argb: 'FFFFFF' } };
        i++

      });
      let countAdded = false
      groupByweek[weeks].forEach((ele: any, index: any) => {

        let keyInd = index + 3
        let dataInd = weekCount * headLen
        // if (weekCount > 0 && countAdded == false) {
        //     dataInd += 1
        // }
        for (let value in ele) {
          console.log(alphabet[dataInd] + keyInd.toString());
          let datacell = worksheet.getCell(alphabet[dataInd] + keyInd.toString())
          datacell.value = ele[value]
          datacell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          }
          dataInd++
        }

      });

      let cellAlpha = weekCount * headLen
      let totalhrLen = (groupByweek[weeks].length + 2).toString()

      worksheet.mergeCells(`${alphabet[cellAlpha]}2:${alphabet[cellAlpha + headLen - 1]}2`)
      if (totalhrLen != '1') {
        worksheet.mergeCells(`${alphabet[cellAlpha + headLen - 1]}3:${alphabet[cellAlpha + headLen - 1]}${totalhrLen}`)
      }
      var mergedCell = worksheet.getCell(alphabet[cellAlpha] + '2');
      var totalhrCell = worksheet.getCell(alphabet[cellAlpha + headLen - 1] + totalhrLen);
      let year: any = moment().format("YYYY")
      let week: any = weeks
      const starD: any = new Date(year, 0, 1 + (week - 1) * 7);
      const endD: any = moment(starD).add(6, 'days').format("DD MMMM YYYY")


      mergedCell.value = `Week - ${weeks} ${moment(starD).format("DD MMMM")} to ${endD} `;
      mergedCell.font = { bold: true }
      mergedCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ADD8E6' }
      };
      mergedCell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      totalhrCell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      // i++
      weekCount++
    }

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my_excel_file.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    })


  }
}
