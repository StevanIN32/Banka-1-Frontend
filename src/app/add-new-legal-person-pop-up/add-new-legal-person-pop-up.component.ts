import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupService } from '../service/popup.service';
import { LegalPerson } from '../model/model';
import {FieldComponentModule} from "../welcome/redesign/FieldCompentn";
import {OutlineOrangeButtonModule} from "../welcome/redesign/OutlineOrangeButton";
import {OrangeButtonModule} from "../welcome/redesign/OrangeButton";
import {DropdownInputModule} from "../welcome/redesign/DropdownInput";
import { LegalPersonService } from '../service/legal-person.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-new-legal-person-pop-up',
  standalone: true,
  imports: [FormsModule, CommonModule, FieldComponentModule, OutlineOrangeButtonModule, OrangeButtonModule, DropdownInputModule],
  templateUrl: './add-new-legal-person-pop-up.component.html',
  styleUrl: './add-new-legal-person-pop-up.component.css'
})

export class AddNewLegalPersonPopUpComponent {

  constructor(private customerService: CustomerService,
    private dialogRef: MatDialogRef<AddNewLegalPersonPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public allLegalPersons: LegalPerson[],
    private popupService: PopupService,
    private legalPersonService: LegalPersonService){}

  addNewLegalPersonData: LegalPerson = {
    companyName: '',
    idNumber: '',
    pib: '',
    cba: '',
    address: ''
  };

  add() {
    if(this.validateForm()) {
      console.log(this.addNewLegalPersonData);
      this.allLegalPersons.push(this.addNewLegalPersonData);
      this.legalPersonService.saveNewLegalPerson(this.addNewLegalPersonData).subscribe(
        res => {
          if(!res) this.popupService.openPopup("Error", "Couldn't add legal person.");
        }
      );
      this.dialogRef.close();
    }
  }

  cancel() {
    console.log(this.allLegalPersons);
    this.dialogRef.close();
  }

  private validateForm(): boolean {

    if (!this.addNewLegalPersonData.companyName) {
      this.popupService.openPopup("Error", "Company name must be filled.");
      return false;
    }

    if (!this.addNewLegalPersonData.pib || !this.hasOnlyDigits(this.addNewLegalPersonData.pib)) {
      this.popupService.openPopup("Error", "PIB is not valid.");
      return false;
    }

    if (!this.addNewLegalPersonData.cba || !this.hasOnlyDigits(this.addNewLegalPersonData.pib)) {
      this.popupService.openPopup("Error", "CBA is not valid.");
      return false;
    }

    if (!this.addNewLegalPersonData.idNumber) {
      this.popupService.openPopup("Error", "idNumber must be filled");
      return false;
    }

    if (!this.addNewLegalPersonData.address) {
      this.popupService.openPopup("Error", "Address must be filled.");
      return false;
    }
    return true;
  }

  private hasOnlyDigits(testingString: string): boolean {
    return /[0-9]+/.test(testingString);
  }

  private isValidJMBG(idNumber: string): boolean {
    return /^\d{13}$/.test(idNumber);
  }
}
