import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.css']
})
export class AddressTabComponent implements OnInit {
  countryDropdown: any;
  stateDropdown: string[][] = [];
  selectedCountry: string = '';
  account_id: any;
  fetched = false;
  item!: FormArray;
  newAddresses: FormGroup[] = [];
  addedAddressLength = 0;
  fetchedLength = 0;
  enableSave = false;
  isEditeEnable: boolean[] = [];
  editEnabled = false;

  reactForm = new FormGroup({
    formArray: new FormArray([])
  });

  constructor(private userService: UsersService, private messageService: MessageService) { }

  get formArray() {
    return this.reactForm.get('formArray') as FormArray;
  }

  ngOnInit(): void {
    this.userService.getCountries().subscribe(
      (countries) => {
        this.countryDropdown = countries;
      },
      (error) => {
        this.userService.logoutUser(error.error.error);
        console.error('Error fetching countries:', error);
      }
    );
    console.log('enable save start: ', this.enableSave);

    if (this.userService.getType() == 'Admin') {
      this.account_id = localStorage.getItem('setPublisherId') || '';
    }
    else {
      this.account_id = this.userService.getAccountId();
    }


    console.log('Account id is: ', this.account_id);
    this.fetchAddress();
    this.stateDropdown = [];
  }

  fetchAddress() {
    const Data = {
      account_id: this.account_id
    };
    this.newAddresses = [];
    this.userService.getUserAddresses(Data).subscribe(
      (response) => {
        const mappedUser = response.addresses.map((address: any) => ({
          id: address.Id,
          address1: address.Address_line_1,
          address2: address.Address_line_2,
          city: address.City,
          country: address.Country,
          state: address.State,
          zipCode: address.Zip_Code,
          isDefaultSelected: address.isDefault
        }));

        this.fetchedLength = mappedUser.length;
        this.isEditeEnable = [];

        for (let i = 0; i < this.fetchedLength; i++) {
          this.isEditeEnable.push(false);
        }

        console.log('edit array at fetch', this.isEditeEnable);

        if (mappedUser.length <= 0) {
          this.fetched = false;
        } else {
          this.fetched = true;
          this.updateAddressForm(mappedUser);
        }
      },
      (error) => {
        console.log('Error in fetching address: ', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching data: ' + error.error.error, life: 5000 });
      }
    );
  }

  onCountryChange(event: any, index: number): void {
    const country = event.target.value;
    this.selectedCountry = country;
    console.log('Country is: ', country);

    this.userService.getStatesByCountryName(country).subscribe(
      (states: any) => {
        this.stateDropdown[index] = states.length === 0 ? [country] : states;
      },
      (error: any) => {
        console.error('Error fetching states:', error);
        this.stateDropdown[index] = [];
      }
    );
  }


  updateAddressForm(mappedUser: any) {
    const formArray = this.reactForm.get('formArray') as FormArray;
    formArray.clear();

    mappedUser.forEach((address: any) => {
      const formGroup = new FormGroup({
        id: new FormControl(address.id),
        checkbox: new FormControl({ value: address.isDefaultSelected === 'Y' ? true : false, disabled: this.fetched }),
        address_line_1: new FormControl(address.address1, [Validators.required, this.userService.maxLengthValidator(1000)]),
        address_line_2: new FormControl(address.address2, this.userService.maxLengthValidator(1000)),
        country: new FormControl(address.country, [Validators.required]),
        state: new FormControl(address.state, [Validators.required]),
        city: new FormControl(address.city, [Validators.required, this.userService.maxLengthValidator(100)]),
        zipcode: new FormControl(address.zipCode, [Validators.required, this.userService.maxLengthValidator(10)])
      });

      formGroup.get('country')?.setValue(address.country, { emitEvent: true });
      formArray.push(formGroup);
    });
  }

  addNewAddress() {
    this.addedAddressLength += 1;
    this.enableSave = true;
    console.log('enableSave is: ', this.enableSave);

    const newAddressFormGroup = this.getNewAddress();
    this.formArray.push(newAddressFormGroup);
    this.newAddresses.push(newAddressFormGroup);
    console.log('Added: ', this.newAddresses);

    this.stateDropdown.push([]);
  }

  getNewAddress(address: any = null) {
    return new FormGroup({
      checkbox: new FormControl(false),
      id: new FormControl(''),
      address_line_1: new FormControl('', [Validators.required, this.userService.maxLengthValidator(1000)]),
      address_line_2: new FormControl('', this.userService.maxLengthValidator(1000)),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required, this.userService.maxLengthValidator(100)]),
      zipcode: new FormControl('', [Validators.required, this.userService.maxLengthValidator(10)])
    });
  }


  removeItem(index: number) {
    const deletedRecordIndex = this.formArray.at(index).get('id')?.value;
    this.formArray.removeAt(index);

    if (deletedRecordIndex === '') {
      console.log('Delete element at: ', index - this.fetchedLength);
      this.newAddresses.splice(index - this.fetchedLength, 1);
    }

    console.log('new newAddress are: ', this.newAddresses.map(group => group.value));
    if (deletedRecordIndex !== '') {
      const Data = {
        id: deletedRecordIndex
      };
      this.userService.delete_user_address(Data).subscribe(
        (response) => {
          console.log('Response of delete: ', response);
          this.fetchedLength -= 1;
          console.log('fetched inside if: ', this.fetchedLength);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address Deleted successfully', life: 5000 });
        },
        (error) => {
          console.log('Error in delete: ', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting address ' + error.error.error, life: 5000 });
        }
      );
    }
    if (this.addedAddressLength <= 0) {
      this.enableSave = false;
    } else if (this.addedAddressLength > 0) {
      this.addedAddressLength -= 1;
      if (this.addedAddressLength === 0) {
        this.enableSave = false;
      }
    }
  }

  onSubmit() {
    this.enableSave = false;
    // console.log('this.newAddresses: ', this.newAddresses);
    // console.log('Form is: ', this.reactForm);

    if (this.reactForm.valid) {
      const newAddressData = this.newAddresses.map(group => group.value);
      const Data = {
        account_id: this.account_id,
        addresses: newAddressData
      };
      this.userService.saveUserAddress(Data).subscribe(
        (response) => {
          // console.log('User Address saved successfully', response);
          this.fetchAddress();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address Saved successfully', life: 5000 });
        },
        (error) => {
          console.log('Error in saving user address', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error saving address ' + error.error.error, life: 5000 });
        }
      );
    } else {
      this.enableSave = true;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required input fields correctly', life: 5000 });
    }
  }

  clickedEdit(index: number) {
    this.isEditeEnable[index] = true;
    this.editEnabled = true;
    const countryControl = this.formArray.at(index).get('country');
    this.formArray.at(index).get('checkbox')?.enable();
    if (countryControl) {
      this.onCountryChange({ target: { value: countryControl.value } } as any, index);
    }
    console.log('edit array is: ', this.isEditeEnable);
  }


  isEnable(index: number) {
    return this.isEditeEnable[index];
  }

  cancelEdit(index: number) {
    this.editEnabled = false;
    this.isEditeEnable[index] = false;
    this.formArray.at(index).get('checkbox')?.disable();
    this.fetchAddress();
    console.log('Array after cancel is: ', this.isEditeEnable);
  }

  saveUserUpdate(index: any) {
    const updatedAddress = this.formArray.at(index).value;
    // console.log('Form is: ', this.reactForm);
    
    if (this.reactForm.valid) {
      const Data = {
        // account_id: this.account_id,
        addresses: updatedAddress
      };
      // console.log('update changes are: ', Data);

      this.userService.updateUserAddress(Data).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address Updated successfully', life: 5000 });
          this.isEditeEnable[index] = false;
          this.editEnabled = false;
          this.fetchAddress();
        },
        (error) => {
          console.log('Error: ', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating address ' + error.error.error, life: 5000 });
        }
      );
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required input fields correctly', life: 5000 });
    }
  }
}
