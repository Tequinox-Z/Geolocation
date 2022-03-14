import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Position } from '../Interface/Position';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  getPositionById(id: string): Observable<Position> {
    const position = doc(this.firestore, `positions/${id}`);
    return docData(position, { idField: 'id'}) as Observable<Position>;
  }

  getPositions(): Observable<Position[]> {
    const notesRef = collection(this.firestore, 'positions');
    return collectionData(notesRef, { idField: 'id'}) as Observable<Position[]>;
  }

  addPosition(position: Position) {
    const serverRef = collection(this.firestore, 'positions');
    return addDoc(serverRef, position);
  }

  deletePosition(position: string) {
    const serverDocRef = doc(this.firestore, `positions/${position}`);
    return deleteDoc(serverDocRef);
  }

  updatePosition(position: Position) {
    const serverDocRef = doc(this.firestore, `positions/${position.id}`);
    return updateDoc(serverDocRef, { name: position.name, lati: position.lati, long: position.long });
  }
}
