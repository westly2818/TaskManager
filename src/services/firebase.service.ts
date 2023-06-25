import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFirestore) { }
  getData(inputData: any) {
    // return new Promise((resolve,reject)=>{
    let collectionName = inputData.collectionName;
    let customer = inputData.customer;

    let conditions: any = undefined;
    if (inputData.conditions) {
      conditions = (inputData.conditions);
    }
    let limit: any = undefined;
    if (inputData.limit) {
      limit = parseInt(inputData.limit);
    }
    let docRef: any = undefined;
    docRef = this.db.collection(`${collectionName}`, ref => {
      let query: any = ref;
      if (conditions && conditions.length > 0) {
        conditions.forEach((element: any) => {
          query = query.where(element.key, element.symbol, element.value)
        });
      }

      if (inputData.orderBy) {
        query = query.orderBy(inputData.orderBy, 'desc');
      }


      if (limit) {
        query = query.limit(limit);
      }
      return query;
    })
    return docRef.get();


  }
}
