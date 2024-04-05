import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { selectOptions } from '../siteAdUnitSizes';
import { masterSize } from '../siteAdUnitSizes';
import { comapnionSize } from '../siteAdUnitSizes';
import { placement } from '../siteAdUnitSizes';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-add-site-ad-units',
  templateUrl: './add-site-ad-units.component.html',
  styleUrl: './add-site-ad-units.component.css'
})
export class AddSiteAdUnitsComponent implements OnInit {

  ad_site = false;
  sizes: any;
  masterSizeOptions: any;
  companionSizeOptions: any;
  placementOptions: any;

  @Input() selectedName: string | undefined;

  @Output() adClosed: EventEmitter<any> = new EventEmitter();

  account = "";
  site_name = '';
  name = "";
  code = "";
  description = "";
  display_ad_size = "";
  refresh_rate = false;
  master_size = "";
  companion_size = "";
  placement_option = "";

  width_received?: number;
  height_received?: number;

  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.account = params['account'];
      console.log(this.account);
    })
    this.sizes = selectOptions;
    this.masterSizeOptions = masterSize;
    this.companionSizeOptions = comapnionSize;
    this.placementOptions = placement;

  }
  getDimensions(selectedOption: string): { width: number, height: number } {
    // Extract width and height from the selected option
    const dimensionsRegex = /(\d+)x(\d+)/;
    const matches = selectedOption.match(dimensionsRegex);
    if (matches && matches.length === 3) {
      const width = parseInt(matches[1], 10);
      const height = parseInt(matches[2], 10);
      return { width, height };
    } else {
      return { width: 0, height: 0 }; // Default values if regex doesn't match
    }
  }
  
  updateDimensions(event: Event): void {
    const selectedOption = (event.target as HTMLSelectElement).value;
    const dimensions = this.getDimensions(selectedOption);
    this.width_received = dimensions.width;
    this.height_received = dimensions.height;

    // Now you can access dimensions.width and dimensions.height
    console.log('Width:', dimensions.width, 'Height:', dimensions.height);
    // Assign width and height to variables or use them as needed
  }
  

  onSubmit(form: any) {
    this.ad_site = true;
    if (form.valid) {
      // console.log("screen size is: ", this.display_ad_size, this.master_size);
      // console.log('companion size is : ', this.companion_size);
      this.getParentAdUnitId();

      // alert('Form is : ' + form.valid);
      // alert('Form submitted!!');
      this.adClosed.emit();
    }
    else {
      alert('Please Fill all details!!!');
    }
  }


  addSiteAdUnit(Data: any) {
    const formData = {
      ad_unit_id: Data.adUnit_id,
      site_id: Data.site_id,
      // site_name: this.site_name,
      publisher_id: Data.publisher_id,
      ad_unit_name: this.name,
      description: this.description,
      size: this.width_received +'x'+ this.height_received,
      format: 'Native',
      parentAdUnitId: Data.parentAdUnitId,

    }
    console.log('Called AddSIteAdUnit', formData);
    
    this.userService.addSiteAdUnit(formData).subscribe(
      (response) => {
        console.log("Added to Site Ad Unit", response);
        alert('Successfully data added to site_ad_unit');
      }, 
      (error) => {
        console.log('Error: ', error);
        alert('Error in adding data to table' );
      }
    )
  }

  createAdUnit(formData: any) {
    this.userService.sendSiteAdUnitRequest(formData).subscribe(
      (response) => {
        console.log('Created Ad Unit', response);
        console.log('Response id', response.id);
        // const site_id= response.id;
        // const parentAdUnit = response.parentAdUnit;
        const Data = {
          adUnit_id: response.id,
          parentAdUnitId: response.parentAdUnitId, 
          site_id: response.site_id,
          publisher_id: response.publisher_id
        }
        console.log('parentAdunit is: ', Data.parentAdUnitId);
        alert('ad Unit Created succefully');
        this.addSiteAdUnit(Data);
      },
      (error) => {
        console.log('Error occured in creating Ad Unit', error);
        alert('Error occured creating Ad Unit !!');
        
      }
    );
  }


  getParentAdUnitId() {
    const payload = {
      account: this.account, 
      site_name: this.site_name
    }
    this.userService.get_site_parentAdUnitId(payload).subscribe(
      (response) => {
        console.log("Received Parent AD Unit Id Successfully", response);
        console.log('Parent id is: ', response.parentAdUnitId);
        
        const formData = {
          account : this.account,
          site_name: this.site_name,
          ad_unit_name: this.name,
          //code:this.code,
          description: this.description,
          parentAdUnitId: response.parentAdUnitId,
          //display_ad_size:this.display_ad_size,
          //refresh_rate: this.refresh_rate,
          //master_size: this.master_size,
          //companion_size: this.companion_size,
          //placement: this.placement_option,
          width: this.width_received,
          height: this.height_received
        }
        alert('Parent Ad Unit is Received');
        console.log(formData);
        this.createAdUnit(formData);
        
      }, 
      (error) => {
        console.log('Error in receiving site Parent Ad Unit Id', error);
        alert('Error in receiving parent ad unit. Error: '+ error.error.error);
        
      }
    )
  }

}
