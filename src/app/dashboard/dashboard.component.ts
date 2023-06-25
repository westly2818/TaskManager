import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service'
// import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private FirebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getdoc()
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
  
}
