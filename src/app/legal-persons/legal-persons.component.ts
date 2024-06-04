import { Component } from '@angular/core';
import { LegalPerson} from '../model/model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LegalPersonService } from '../service/legal-person.service';
import { HttpErrorResponse } from '@angular/common/http';
import {PopupService} from "../service/popup.service";
import { MatDialog } from '@angular/material/dialog';
import { AddNewLegalPersonPopUpComponent } from '../add-new-legal-person-pop-up/add-new-legal-person-pop-up.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-legal-persons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-persons.component.html',
  styleUrl: './legal-persons.component.css'
})
export class LegalPersonsComponent {
  // Initially set the first tab as active (This page only has one tab for now)
  activeTab: string = 'overviewTab';

  // Function to change the active tab (This page only has one tab for now)
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  public allLegalPersons: LegalPerson[] = [];
  loggedUserId:number = -1;

  constructor(private legalPersonService: LegalPersonService, private router: Router, private popup:PopupService, private dialog: MatDialog) {
    let loggedUserIdAsString = sessionStorage.getItem('loggedUserID');

    if (loggedUserIdAsString !== null) {
      this.loggedUserId = parseInt(loggedUserIdAsString);
    } else {
      console.log('Error occurred: logged user id cannot be null!');
    }
   }

   ngOnInit() {
    this.loadAllLegalPersons();
  }

   loadAllLegalPersons()
   {
    this.legalPersonService.getAllLegalPersons().subscribe(
      (allLegalPersonsData: LegalPerson[]) => {
        this.allLegalPersons = allLegalPersonsData;

        console.log('All legal persons data loaded');
        console.log(this.allLegalPersons);
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
      }
    );
   }


   joinCustomer(legalPerson: LegalPerson, idx: number){
    console.log("Join pressed for legal peron at idx " + idx);
    console.log(legalPerson);

    this.popup.openJoinLegalPersonAndCustomerPopUp(legalPerson);
  }

  addNewLegalPerson(){
    console.log("Adding new legal person pressed");

    const dialogRef = this.dialog.open(AddNewLegalPersonPopUpComponent, {
      data: this.allLegalPersons,
      disableClose: true // Prevents closing the dialog by clicking outside or pressing ESC
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');

      if(! environment.shouldUseMockedDataForLegalPersons)
      {
        this.loadAllLegalPersons();
      }
    });
  }
}
