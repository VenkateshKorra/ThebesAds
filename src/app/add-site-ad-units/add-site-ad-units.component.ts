import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { selectOptions } from '../siteAdUnitSizes';
import { masterSize } from '../siteAdUnitSizes';
import { comapnionSize } from '../siteAdUnitSizes';
import { placement } from '../siteAdUnitSizes';
import { UsersService } from '../users.service';
import { Location } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-site-ad-units',
  templateUrl: './add-site-ad-units.component.html',
  styleUrl: './add-site-ad-units.component.css'
})
export class AddSiteAdUnitsComponent implements OnInit, AfterViewInit {

  ad_site = false;
  sizes: any;
  masterSizeOptions: any;
  companionSizeOptions: any;
  placementOptions: any;
  site_name_dropdown: any;
  displayRadio: boolean = false;
  videoRadio: boolean = false;
  selectedOption: string = 'display'; // Set the initial value to 'display'


  @Input() selectedName: string | undefined;

  @Output() adClosed: EventEmitter<any> = new EventEmitter();

  account: any;
  site_name = '';
  publisherFromDropdown: any | '';
  name = "";
  code = "";
  description = "";
  display_ad_size: any;
  refresh_rate = false;
  master_size = "";
  companion_size = "";
  placement_option = "";
  created_by = ''

  account_selected: any | '';

  typeOfUser: any;


  isInterstitial: any;
  isNative: any;
  isFluid: any;
  isSmart_Banner: any;
  isAspectRatio = 0;

  width_received = '';
  height_received = '';

  currentUrl = '';
  accountIdSent: any;
  dimensionsReceived: any;
  displayAdSizeString = '';
  accountDataArray: any;

  account_id_selected: any;
  account_name_selected: any;

  ad_format_selected: any;

  adUnitNameTextLength = false;
  codeTextLength = false;

  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService, private location: Location, private router: Router, private messageService: MessageService) { }
  ngOnInit(): void {

    this.typeOfUser = this.userService.getType();
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.account = params['account'];
    //   console.log(this.account);
    // })
    this.publisherFromDropdown = '';
    this.account_selected = '';
    this.currentUrl = this.router.url;
    console.log('Url is: ', this.currentUrl);
    this.optionSelected({ target: { value: this.selectedOption } });
    // 

    if (this.typeOfUser == 'Admin' || this.typeOfUser =='AdOpsManager' || this.typeOfUser == 'Distributor') {
      this.fetchAccountData();
      this.account = this.userService.getSelectedPublisherName();
    }
    else {
      this.account_selected = this.userService.getName();
      this.account = this.userService.getName();
      this.getDropdowns();
    }
    this.sizes = selectOptions;
    this.masterSizeOptions = masterSize;
    this.companionSizeOptions = comapnionSize;
    this.placementOptions = placement;

  }

  ngAfterViewInit(): void {
    if (this.userService.getType() == 'Admin') {
      const receivedUserData = localStorage.getItem('userData');
      if (receivedUserData) {
        const userDataObject = JSON.parse(receivedUserData);
        this.created_by = userDataObject['User_Name'];
        // console.log('Received User Name is: ', this.created_by);
      }
    }
    else {
      this.created_by = this.userService.getName();
      // console.log('Received user name is: ', this.created_by);

    }
  }

  // getDimensions(selectedOption: string): { width: number, height: number } {
  //   // Extract width and height from the selected option
  //   const dimensionsRegex = /(\d+)x(\d+)/;
  //   const matches = selectedOption.match(dimensionsRegex);
  //   if (matches && matches.length === 3) {
  //     const width = parseInt(matches[1], 10);
  //     const height = parseInt(matches[2], 10);
  //     return { width, height };
  //   } else {
  //     return { width: 0, height: 0 }; // Default values if regex doesn't match
  //   }
  // }


  checkAdUnitNameTextLength() {
    if (this.name.length > 500) {
      this.adUnitNameTextLength = true;
    }
    else {
      this.adUnitNameTextLength = false;
    }
  }

  goback() {
    this.router.navigate(['/site-ad-units']);
  }

  checkCodeTextLength() {
    if (this.code.length > 500) {
      this.codeTextLength = true;
    }
    else {
      this.codeTextLength = false;
    }
  }

  updateDimensions(): void {
    // console.log('ngModle is: ', this.display_ad_size);
    this.isInterstitial = 0;
    this.isFluid = 0;
    this.isNative = 0;

    const dimensions = this.display_ad_size.map((size: any) => {
      if (size == 'Interstitial') {
        this.isInterstitial = 1;
        // console.log('Interstital'); 
        return { width: 0, height: 0 }
      }
      else if (size == 'Fluid') {
        this.isFluid = 1;
        return { width: 0, height: 0 }
      }
      else if (size == 'Native') {
        this.isNative = 1;
        return { width: 0, height: 0 }
      }
      else {
        const [width, height] = size.split('x').map(Number); // Split the string and convert substrings to numbers
        return { width, height };
      }
    });
    // this.width_received = dimensions[0].width;
    //  this.height_received = dimensions[0].height;
    //  console.log('width and height is:  ', this.width_received, this.height_received);

    // console.log('Dimensions are: ', dimensions);
    this.dimensionsReceived = dimensions;

    // Assign width and height to variables or use them as needed
  }


  checkSpaces(text: string) {
    return /\s/.test(text);

  }
  optionSelected(event: any) {
    const option = event.target.value;
    // console.log('Received event is: ', option);

    // Based on the selected option, set displayRadio and videoRadio flags
    if (option === 'display') {
      this.displayRadio = true;
      this.videoRadio = false;
    } else if (option === 'video') {
      this.displayRadio = false;
      this.videoRadio = true;
    }

    // console.log('Display is:', this.displayRadio);
    // console.log('Video is:', this.videoRadio);
  }

  SelectedAccount() {
    // console.log('account selected is',this.account_selected);

    this.account_id_selected = this.account_selected.account_id;
    this.account_name_selected = this.account_selected.account_name;
    // console.log('selected name and id is: ', this.account_id_selected, this.account_name_selected);

    if (this.account_id_selected) {
      this.getDropdowns();
    }

  }


  onSubmit(form: any) {

    if (this.adUnitNameTextLength || this.codeTextLength) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter valid input sizes', life: 5000 });
    }
    else {
      if (form.valid) {
        // console.log('Refresh Rate is: ', this.refresh_rate);

        if (this.displayRadio) {
          this.ad_format_selected = 'Display';
          this.displayAdSizeString = this.display_ad_size.join(', '); // converting array to string to save it in tables.

          // Initialize variables to store width and height strings
          let widthString = '';
          let heightString = '';

          // Process the first dimension separately
          if (this.dimensionsReceived[0].width !== 0 && this.dimensionsReceived[0].height !== 0) {
            widthString = this.dimensionsReceived[0].width.toString();
            heightString = this.dimensionsReceived[0].height.toString();
          }

          // Process subsequent dimensions
          for (let i = 1; i < this.dimensionsReceived.length; i++) {
            if (this.dimensionsReceived[i].width !== 0 && this.dimensionsReceived[i].height !== 0) {
              if (widthString !== '' && heightString !== '') {
                // Add comma only if both width and height are non-zero and at least one dimension has been added before
                widthString += ',';
                heightString += ',';
              }
              widthString += this.dimensionsReceived[i].width.toString();
              heightString += this.dimensionsReceived[i].height.toString();
            }
          }

          // Assign the final strings to the width_received and height_received properties
          this.width_received = widthString;
          this.height_received = heightString;

          // console.log('Width is: ', this.width_received);
          // console.log('Height is: ', this.height_received);
        } else {
          this.ad_format_selected = 'Video';
        }

        // console.log('Display sizes are: ', this.display_ad_size);

        this.ad_site = true;
        this.site_name = this.publisherFromDropdown.site_name;
        // console.log('Site name is : ',this.publisherFromDropdown.site_name);
        // console.log('Site Account ID is : ',this.publisherFromDropdown.account_id);
        const whiteSpaces = this.checkSpaces(this.code);
        console.log(whiteSpaces);

        if (whiteSpaces) {
          // alert('Please remove space in your code input.');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please remove space in your code input', life: 5000 });
        } else {

          this.getParentAdUnitId();
          this.adClosed.emit();
        }

        // console.log("screen size is: ", this.display_ad_size, this.master_size);
        // console.log('companion size is : ', this.companion_size);
      }
      else {
        // alert('Please Fill all details!!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please fill all details', life: 5000 });
      }
    }
  }

  getDropdowns() {
    // if (this.userService.getType() == 'Admin' && this.currentUrl == '/add-site-ad-units') {
    //   this.accountIdSent = this.userService.getSelectedPublisherId();
    // }
    // else if (this.userService.getType() == 'Publisher') {
    //   this.accountIdSent = this.userService.getAccountId();
    // }

    let Data;
    if(this.typeOfUser == 'Admin' || this.typeOfUser == 'AdOpsManager' || this.typeOfUser =='Distributor') {
      Data = {
        type: this.userService.getType(),
        account_id:  this.account_id_selected,
        currentUrl: this.currentUrl
      }
    }
    else {
      Data = {
        type: this.userService.getType(),
        account_id: this.userService.getAccountId(),
        currentUrl: this.currentUrl
      }
    }
    
    // console.log('Data is: ', Data);

    this.userService.getSiteNameAndAccountId(Data).subscribe(
      (response: any[]) => {
        // Map the response to extract only app_name and publisher_id
        const mappedUsers: { site_name: string, account_id: string }[] = response.map(user => ({
          site_name: user.Site_name,
          account_id: user['Account_Id'],
          site_id: user.Site_Id,
          account_id_name: user.Site_Id + ' - ' + user.Site_name
        }));
        this.site_name_dropdown = mappedUsers;
      },
      (error) => {
        console.log('Error Fetching users:', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error Fetching Site table!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error  fetching site names!!!', life: 5000 });
      }
    );
  }

  fetchAccountData() {
    const Data = {
      type: this.userService.getType()
    }
    this.userService.getAccountNames(Data).subscribe(
      (response) => {
        const mappedData = response.map((user: any) => ({
          account_id: user.Account_Id,
          account_name: user['Account_Name'],
          account_id_name: user.Account_Id + '-' + user['Account_Name']
        }));
        // console.log('mapped data is: ',  mappedData);

        this.accountDataArray = mappedData;
        // console.log('Sucessful in getting Account Names: ',this.accountDataArray);
      },
      (error) => {
        // alert('Error: '+ error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }


  addSiteAdUnit(Data: any) {
    const formData = {
      ad_unit_id: Data.adUnit_id,
      site_id: Data.site_id,
      // site_name: this.site_name,
      account_id: Data.account_id,
      ad_unit_name: this.name,
      description: this.code,
      size: this.displayAdSizeString,
      format: this.ad_format_selected,
      parentAdUnitId: null,
      created_by: this.created_by
    }
    // console.log('Called AddSIteAdUnit', formData);

    this.userService.addSiteAdUnit(formData).subscribe(
      (response) => {
        // console.log("Added to Site Ad Unit", response);
        // alert('Ad Unit Created Successfully!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ad Unit Created Successfully!!!', life: 5000 });

      },
      (error) => {
        console.log('Error: ', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error in creating Ad Unit');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in creating Ad Unit !!!', life: 5000 });
      }
    )
    this.location.back();
  }

  createAdUnit(formData: any) {
    // console.log('FormData is: ', formData);

    this.userService.sendSiteAdUnitRequest(formData).subscribe(
      (response) => {
        // console.log('Created Ad Unit', response);
        // console.log('Response id', response.id);
        // const site_id= response.id;
        // const parentAdUnit = response.parentAdUnit;
        const Data = {
          adUnit_id: response.id,
          parentAdUnitId: response.parentAdUnitId,
          site_id: response.site_id,
          account_id: response.publisher_id
        }
        // console.log('parentAdunit is: ', Data.parentAdUnitId);
        // alert('ad Unit Created succefully');
        this.addSiteAdUnit(Data);
      },
      (error) => {
        console.log('Error occured in creating Ad Unit', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error occured while creating Ad Unit !!'+ error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });

      }
    );
  }


  getParentAdUnitId() {
    const payload = {
      account: this.userService.getType() == 'Admin' ? this.account_name_selected : this.account,
      site_name: this.publisherFromDropdown.site_name,
      account_id: this.account_id_selected
    }
    this.userService.get_site_parentAdUnitId(payload).subscribe(
      (response) => {
        // console.log("Received Parent AD Unit Id Successfully", response);
        // console.log('Parent id is: ', response.ParentAdUnitId);

        const formData = {
          account: payload.account,
          site_name: this.site_name,
          ad_unit_name: this.name,
          code:this.code,
          // description: this.description,
          parentAdUnitId: response.ParentAdUnitId,
          width: this.width_received,
          height: this.height_received,
          Ad_format: this.ad_format_selected,
          isInterstitial: this.isInterstitial,
          isNative: this.isNative,
          isFluid: this.isFluid,
          // isAspectRatio: this.isAspectRatio,
          refresh_rate: this.refresh_rate ? 1 : 0
        }


        // console.log("formData",formData);
        this.createAdUnit(formData);
        // alert('Parent Ad Unit is Received: '+ formData.parentAdUnitId);

      },
      (error) => {
        console.log('Error in receiving site Parent Ad Unit Id', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error : '+ error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }

}
