import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {Contract} from "../model/model";

@Pipe({
  name: 'transformStatus'
})
export class TransformStatusPipe implements PipeTransform {

  transform(contract: Contract): string {
    if (!contract.bankApproval || !contract.sellerApproval) {
      return 'Denied';
    } else if (contract.bankApproval && contract.sellerApproval) {
      return 'Approved';
    } else {
      return 'Processing';
    }
  }

}

@NgModule({
  declarations: [
    // other components
    TransformStatusPipe
  ],
  exports: [
    TransformStatusPipe
  ],
  // other module properties
})
export class TransformStatusPipeModule { }
