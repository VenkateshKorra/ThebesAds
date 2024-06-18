import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contacts-tab',
  templateUrl: './contacts-tab.component.html',
  styleUrl: './contacts-tab.component.css'
})
export class ContactsTabComponent {
  countryDropdown: any;
  stateDropdown: string[][] = [];
  selectedCountry: string = '';
  account_id: any;
  fetched = false;
  item!: FormArray;
  newContacts: FormGroup[] = [];
  addedContactsLength = 0;
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
    console.log('enable save start: ', this.enableSave);

    if (this.userService.getType() == 'Admin') {
      this.account_id = localStorage.getItem('setPublisherId') || '';
    }
    else {
      this.account_id = this.userService.getAccountId();
    }


    console.log('Account id is: ', this.account_id);
    this.fetchContacts();
    // this.stateDropdown = [];
  }

  fetchContacts() {
    const Data = {
      account_id: this.account_id
    };
    this.newContacts = [];
    this.userService.getUserContacts(Data).subscribe(
      (response) => {
        const mappedUser = response.addresses.map((address: any) => ({
          id: address.Id,
          name: address.Name,
          email: address.Email,
          phoneNo: address.PhoneNo,
          designation: address.Designation,
          address: address.Address,
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
          this.updateContactsForm(mappedUser);
        }
      },
      (error) => {
        console.log('Error in fetching address: ', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching data: ' + error.error.error, life: 5000 });
      }
    );
  }

  // onCountryChange(event: any, index: number): void {
  //   const country = event.target.value;
  //   this.selectedCountry = country;
  //   console.log('Country is: ', country);

  //   this.userService.getStatesByCountryName(country).subscribe(
  //     (states: any) => {
  //       this.stateDropdown[index] = states.length === 0 ? [country] : states;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching states:', error);
  //       this.stateDropdown[index] = [];
  //     }
  //   );
  // }


  updateContactsForm(mappedUser: any) {
    const formArray = this.reactForm.get('formArray') as FormArray;
    formArray.clear();

    mappedUser.forEach((address: any) => {
      const formGroup = new FormGroup({
        id: new FormControl(address.id),
        checkbox: new FormControl({ value: address.isDefaultSelected === 'Y' ? true : false, disabled: this.fetched }),
        name: new FormControl(address.name, [Validators.required, this.userService.maxLengthValidator(100)]),
        email: new FormControl(address.email, [Validators.required, this.userService.maxLengthValidator(100)]),
        phoneNo: new FormControl(address.phoneNo, [Validators.required, this.userService.maxLengthValidator(20)]),
        designation: new FormControl(address.designation, this.userService.maxLengthValidator(500)),
        address: new FormControl(address.address, this.userService.maxLengthValidator(500)),
      });

      // formGroup.get('country')?.setValue(address.country, { emitEvent: true });
      formArray.push(formGroup);
    });
  }

  addNewContacts() {
    this.addedContactsLength += 1;
    this.enableSave = true;
    // console.log('enableSave is: ', this.enableSave);

    const newContactsFormGroup = this.getNewContacts();
    this.formArray.push(newContactsFormGroup);
    this.newContacts.push(newContactsFormGroup);
    console.log('Added: ', this.newContacts);

    // this.stateDropdown.push([]);
  }

  getNewContacts(address: any = null) {
    return new FormGroup({
      checkbox: new FormControl(false),
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, this.userService.maxLengthValidator(100)]),
      email: new FormControl('', [Validators.required, this.userService.maxLengthValidator(100)]),
      phoneNo: new FormControl('', [Validators.required, this.userService.maxLengthValidator(20)]),
      designation: new FormControl('', this.userService.maxLengthValidator(500)),
      address: new FormControl('', this.userService.maxLengthValidator(500)),
    });
  }

  removeItem(index: number) {
    const deletedRecordIndex = this.formArray.at(index).get('id')?.value;
    this.formArray.removeAt(index);

    if (deletedRecordIndex === '') {
      console.log('Delete element at: ', index - this.fetchedLength);
      this.newContacts.splice(index - this.fetchedLength, 1);
    }

    console.log('new newAddress are: ', this.newContacts.map(group => group.value));
    if (deletedRecordIndex !== '') {
      const Data = {
        id: deletedRecordIndex
      };
      this.userService.delete_user_contacts(Data).subscribe(
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
    if (this.addedContactsLength <= 0) {
      this.enableSave = false;
    } else if (this.addedContactsLength > 0) {
      this.addedContactsLength -= 1;
      if (this.addedContactsLength === 0) {
        this.enableSave = false;
      }
    }
  }

  onSubmit() {
    this.enableSave = false;
    // console.log('this.newContacts: ', this.newContacts);
    // console.log('reactForm is: ', this.reactForm);


    if (this.reactForm.valid) {
      const newAddressData = this.newContacts.map(group => group.value);
      const Data = {
        account_id: this.account_id,
        contacts: newAddressData
      };
      // console.log('New contacts data sent is: ', Data);

      this.userService.saveUserContacts(Data).subscribe(
        (response) => {
          // console.log('User Address saved successfully', response);
          this.fetchContacts();
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
    this.formArray.at(index).get('checkbox')?.enable();
    // const countryControl = this.formArray.at(index).get('country');
    // if (countryControl) {
    //   this.onCountryChange({ target: { value: countryControl.value } } as any, index);
    // }
    // console.log('edit array is: ', this.isEditeEnable);
  }


  isEnable(index: number) {
    return this.isEditeEnable[index];
  }

  cancelEdit(index: number) {
    this.editEnabled = false;
    this.isEditeEnable[index] = false;
    this.formArray.at(index).get('checkbox')?.disable();
    this.fetchContacts();
    // console.log('Array after cancel is: ', this.isEditeEnable);
  }

  saveUserUpdate(index: any) {
    const updatedAddress = this.formArray.at(index).value;
    if (this.reactForm.valid) {
      // console.log('form is false');
      // console.log(this.reactForm);
      const Data = {
        // account_id: this.account_id,
        contacts: updatedAddress
      };
      // console.log('update changes are: ', Data);

      this.userService.updateUserContacts(Data).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address Updated successfully', life: 5000 });
          this.isEditeEnable[index] = false;
          this.editEnabled = false;
          this.fetchContacts();
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
