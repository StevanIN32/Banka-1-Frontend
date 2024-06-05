import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TransparentTextFieldModule} from "../welcome/redesign/TransparentTextField";
import {OutlineOrangeButtonModule} from "../welcome/redesign/OutlineOrangeButton";
import {OrangeButtonModule} from "../welcome/redesign/OrangeButton";
import {FieldComponentModule} from "../welcome/redesign/FieldCompentn";
import {DropdownInputModule} from "../welcome/redesign/DropdownInput";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BankAccountService} from "../service/bank-account.service";
import {PublicStock, StockListing} from "../model/model";
import {PopupService} from "../service/popup.service";

@Component({
  selector: 'app-public-security-offer-popup',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    TransparentTextFieldModule,
    OutlineOrangeButtonModule,
    OrangeButtonModule,
    FieldComponentModule,
    DropdownInputModule],
  templateUrl: './public-security-offer-popup.component.html',
  styleUrl: './public-security-offer-popup.component.css'
})
export class PublicSecurityOfferPopupComponent {
    volumeOfStock: string = '';
    priceOffer: string = '';

    warnMessage: string = '';

    security: PublicStock;

    isEmployee: boolean;
    isCustomer: boolean;


    constructor(
      public bankAccountService: BankAccountService,
      public dialogRef: MatDialogRef<PublicSecurityOfferPopupComponent>,
      public popupService: PopupService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.security = data;
      this.isEmployee = sessionStorage.getItem('role') === 'employee' ||
        sessionStorage.getItem('role') === 'admin' ||
        sessionStorage.getItem('role') === 'agent' ||
        sessionStorage.getItem('role') === 'supervizor';
      this.isCustomer = sessionStorage.getItem('role') === 'customer';
      // console.log(this.security.amount);
      // console.log(this.security.publicOffers.id.amount);

    }

    onCancelButton(){
      this.dialogRef.close();
    }

    onMakeAnOffer() {
      if (!this.validInputOffer() && !this.validInputVolume()) {
        if (this.volumeOfStock != '' && this.priceOffer != '') {
          const volume = parseFloat(this.volumeOfStock);
          const offer = parseFloat(this.priceOffer);
          if (volume >= 0 || offer >= 0) {
            console.log("SECURITY");
            console.log(this.security)
            if (volume <= this.security.amount) {
              // this.bankAccountService.makeAnOffer(this.security, volume, offer);
              if (this.isCustomer) {
                this.bankAccountService.makeAnOfferCustomer(this.security, volume, offer).subscribe( res => {
                  console.log(res);
                  this.popupService.openPopup("Offer made successfully.", "Success");
                });
              } else if (this.isEmployee) {
                this.bankAccountService.makeAnOfferEmployee(this.security, volume, offer).subscribe( res => {
                  console.log(res);
                  this.popupService.openPopup("Offer made successfully.", "Success");
                });
              }
              this.warnMessage = "";
              this.dialogRef.close();
              // if (volume >= 0 || offer >= 0) { // Ako je volume vece od onoga sto je ponudjeno na trzistu
              // if (volume >= this.security.amount) { // Ako je volume vece od onoga sto je ponudjeno na trzistu
              //   this.warnMessage = "Asked volume too high."
              // } else {
              //   this.bankAccountService.makeAnOffer(this.security, volume, offer);
              // }
            } else {
              this.warnMessage = "Asked volume too high."
            }
          } else {
            this.warnMessage = "Both volume and price need to be positive numbers."
          }
        } else {
          this.warnMessage = "Both volume and price are required.";
        }
      } else {
        this.warnMessage = "";
      }
    }

    validInputVolume(){
      if(this.volumeOfStock == '') return false;
      return isNaN(parseFloat(this.volumeOfStock));
    }

    validInputOffer(){
      if(this.priceOffer == '') return false;
      return isNaN(parseFloat(this.priceOffer));
    }




}
