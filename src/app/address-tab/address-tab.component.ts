import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.css']
})
export class AddressTabComponent implements OnInit {
  countryDropdown: any;
  stateDropdown: string[] = [];
  selectedCountry: string = '';
  account_id: any;

  item!: FormArray;

  reactForm = new FormGroup({
    formArray: new FormArray([])
  });

  constructor(private stateService: UsersService) {}

  get formArray() {
    return this.reactForm.get("formArray") as FormArray;
   }


  ngOnInit(): void {
    this.stateService.getCountries().subscribe(
      (countries) => {
        this.countryDropdown = countries;
      },
      (error) => {
        this.stateService.logoutUser(error.error.error);
        console.error('Error fetching countries:', error);
      }
    );
    this.addNewAddress();
    this.account_id = localStorage.getItem('setPublisherId') || '';
    console.log('Account id is: ', this.account_id);
    
    this.stateDropdown = [];
  }

  onCountryChange(event: Event): void {
    const country = (event.target as HTMLSelectElement).value;
    this.selectedCountry = country;
    console.log('Country is: ', country);
    

    this.stateService.getStatesByCountryName(country).subscribe(
      (states: any) => {
        this.stateDropdown=[];
        console.log('States are: ', states);
        if (states.length === 0) {
          console.log('Inside empty states for country', states.length);
          this.stateDropdown.push(country); // Adding country name to dropdown
          console.log('States added is: ', this.stateDropdown);
          
        } else {
          this.stateDropdown = states; // Use the retrieved states
        }
      },
      (error: any) => {
        console.error('Error fetching states:', error);
        this.stateDropdown = [];
      }
    );    
  }

  addNewAddress() {
    const formArray = this.reactForm.get('formArray') as FormArray;
    formArray.push(this.getNewAddress());
  }

  getNewAddress() {
    return new FormGroup({
      checkbox: new FormControl(false,),
      address_line_1: new FormControl('', Validators.required),
      address_line_2: new FormControl('', ),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required)
    });
  }

  removeItem(index: number) {
    this.formArray.removeAt(index);
    // alert('Removed at index: '+index);
  }

  onSubmit() {
    console.log('reactform data is: ', this.reactForm.value);
    
  }
}
