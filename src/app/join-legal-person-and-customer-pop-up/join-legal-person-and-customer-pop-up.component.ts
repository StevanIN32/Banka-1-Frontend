import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupService } from '../service/popup.service';
import { Customer, LegalPerson } from '../model/model';
import {FieldComponentModule} from "../welcome/redesign/FieldCompentn";
import {OutlineOrangeButtonModule} from "../welcome/redesign/OutlineOrangeButton";
import {OrangeButtonModule} from "../welcome/redesign/OrangeButton";
import {DropdownInputModule} from "../welcome/redesign/DropdownInput";
import { LegalPersonService } from '../service/legal-person.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-legal-person-and-customer-pop-up',
  standalone: true,
  imports: [FormsModule, CommonModule, FieldComponentModule, OutlineOrangeButtonModule, OrangeButtonModule, DropdownInputModule],
  templateUrl: './join-legal-person-and-customer-pop-up.component.html',
  styleUrl: './join-legal-person-and-customer-pop-up.component.css'
})
export class JoinLegalPersonAndCustomerPopUpComponent {

  customers: Customer[] = []
  customersFullNames: string[] = []
  selectedCustomerToJoin: Customer = {
    userId: -1,
    firstName: '',
    lastName: '',
    email: '',
    jmbg: '',
    phoneNumber: '',
    gender: '',
    address: '',
    isLegalEntity: false
  };

  constructor(private dialogRef: MatDialogRef<JoinLegalPersonAndCustomerPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public legalPerson: LegalPerson,
    private customerService: CustomerService,
    private popup:PopupService,
    private legalPersonService: LegalPersonService) {}

  ngOnInit(): void {
    console.log("Legal person passed to popUp:");
    console.log(this.legalPerson);

    this.customerService.getAllCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.customers = customers;
        this.customersFullNames = customers.map(customer => customer.firstName + ' ' + customer.lastName);
        console.log(customers);
        console.log(this.customersFullNames);
      },
      error: (error: any) => {
        this.popup.openPopup("Error", "Failed to load customers.");
      }
    });
  }

  onSelectionChange(selectedValue: any): void {
    this.selectedCustomerToJoin = selectedValue;  // Assign the selected value to a component property
    console.log('Selected value:', this.selectedCustomerToJoin);  // Optional: Log the selected value
  }

  close() {
    this.dialogRef.close();
  }

  join(){
    if(this.selectedCustomerToJoin.userId === -1)
    {
      this.popup.openPopup("Error", "Must select a customer before pressing join.");
    }
    else
    {
      this.legalPersonService.joinLegalPersonAndCustomer(this.legalPerson, this.selectedCustomerToJoin).subscribe();
      //TODO: this.popup.openPopup("Succcess", "Successfully joined.");  --Add this when backend is done and not mocked
      this.dialogRef.close();
    }
  }

}
