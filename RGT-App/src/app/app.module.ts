import { IconsModule } from './icons.module';
import { UmrahComponent } from './components/cms/umrah/umrah.component';

import { AlertComponent } from './directives/alert.component';
import { AlertService } from './services/index';
import { MainServiceService } from './services/main.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutingModule } from './routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule,
  MatCheckboxModule, MatProgressBarModule, MatCardModule, MatTableModule, MatPaginatorModule, MatIconModule, MatSortModule,
  MatProgressSpinnerModule, MatExpansionModule, MatTabsModule, MatMenuModule, MatNativeDateModule, MatAutocompleteModule, MatSelectModule
} from '@angular/material';

import {ToasterModule} from 'angular2-toaster';
import {NgxMaskModule} from 'ngx-mask'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewPropertyComponent } from './components/new-property/new-property.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { HttpModule } from '@angular/http';
import { DataServiceService } from './services/data-service.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MultiselectDropdownModule } from 'angular-4-dropdown-multiselect';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImageUploadModule } from "angular2-image-upload";
import { HotelPreviewComponent } from './components/hotel-preview/hotel-preview.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { JwtInterceptor } from './helpers/index';
import { AuthGuard } from './guards/index';
import { AuthenticationService, UserService } from './services/index';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { Ng2StickyModule } from 'ng2-sticky';
import { NgxGalleryModule } from 'ngx-gallery';
import { TestFormComponent } from './test-form/test-form.component';
import { UsersComponent } from './components/users/users.component';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { PagesComponent } from './components/cms/pages/pages.component';
import { NewpageComponent } from './components/cms/newpage/newpage.component';
import { DealsComponent } from './components/cms/deals/deals.component';
import { NewDealComponent } from './components/cms/new-deal/new-deal.component';
import { MenuComponent } from './components/cms/menu/menu.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CKEditorModule } from 'ngx-ckeditor';
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';
// translate
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VisaComponent } from './components/cms/visa/visa.component';
import { NewVisaComponent } from './components/cms/new-visa/new-visa.component';
import { SectionsComponent } from './components/cms/sections/sections.component';
import { NewSectionComponent } from './components/cms/new-section/new-section.component';
import { FlightSearchComponent } from './components/flights/flight-search/flight-search.component';
import { VisaDetailsComponent } from './components/cms/visa-details/visa-details.component';
import { MasterlistsComponent } from './components/cms/masterlists/masterlists.component';
import { ViewDealsComponent } from './view-deals/view-deals.component';
import { ScrollerComponent } from './scroller/scroller.component';
import { ViewAllScrollerComponent } from './view-all-scroller/view-all-scroller.component';
import { CamelcaseSpacePipe } from './pipes/camelcase-space.pipe';
import { ViewScrollerComponent } from './view-scroller/view-scroller.component';
import { ViewPageComponent } from './view-page/view-page.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { NavbarContentsComponent } from './components/cms/navbar-contents/navbar-contents.component';
import { AirlinesHotelsContentsComponent } from './components/cms/airlines-hotels-contents/airlines-hotels-contents.component';
import { NewAirlineHotelContentsComponent } from './components/cms/new-airline-hotel-contents/new-airline-hotel-contents.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { TermsComponent } from './components/cms/terms/terms.component';
import { UbcTermsConditionsComponent } from './components/cms/ubc-terms-conditions/ubc-terms-conditions.component';
import { DesignCustomPkgComponent } from './components/cms/umrah/design-custom-pkg.component';
import { AddEditHotelComponent } from './components/cms/umrah/add-edit-hotel/add-edit-hotel.component';
import {CalendarModule} from 'primeng/calendar';
import { CallBackQueriesComponent } from './components/cms/call-back-queries/call-back-queries.component';
import { HotelsListComponent } from './components/cms/umrah/hotels-list/hotels-list.component';
import { TransportListComponent } from './components/cms/umrah/transport-list/transport-list.component';
import { DialogModule } from 'primeng/dialog';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { FlightsComponent } from './components/cms/flights/flights.component';
import { HotelsComponent } from './components/cms/hotels/hotels.component';
import { TicketReportComponent } from './components/cms/ticket-report/ticket-report.component';
import { KeyValuePipe } from './key-value.pipe';
// import { IconsModule } from 'app/icons.module';

// import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    NewPropertyComponent,
    SidebarComponent,
    PropertiesComponent,
    HotelPreviewComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterUserComponent,
    AlertComponent,
    TestFormComponent,
    UsersComponent,
    PagesComponent,
    NewpageComponent,
    DealsComponent,
    NewDealComponent,
    MenuComponent,
    VisaComponent,
    NewVisaComponent,
    SectionsComponent,
    NewSectionComponent,
    FlightSearchComponent,
    VisaDetailsComponent,
    MasterlistsComponent,
    ViewDealsComponent,
    ScrollerComponent,
    ViewAllScrollerComponent,
    CamelcaseSpacePipe,
    SafeHtmlPipe,
    ViewScrollerComponent,
    ViewPageComponent,
    NavbarContentsComponent,
    AirlinesHotelsContentsComponent,
    NewAirlineHotelContentsComponent,
    NewUserComponent,
    UmrahComponent,
    TermsComponent,
    UbcTermsConditionsComponent,
    DesignCustomPkgComponent,
    AddEditHotelComponent,
    CallBackQueriesComponent,
    HotelsListComponent,
    TransportListComponent,
    FlightsComponent,
    HotelsComponent,
    TicketReportComponent,
    KeyValuePipe,
  ],
  imports: [
   
    MatGridListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMenuModule,
    BrowserModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    HttpModule,
    MultiselectDropdownModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatRadioModule,
    MatCheckboxModule,
    ImageUploadModule.forRoot(),
    HttpClientModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    Ng2StickyModule,
    NgxGalleryModule,
    MatExpansionModule,
    PasswordStrengthBarModule,
    IconsModule,
    MatSelectModule,
    CalendarModule,
    DialogModule,
    OverlayPanelModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CKEditorModule,
    FancyImageUploaderModule,
    MatAutocompleteModule,
    ToasterModule.forRoot(),
    NgxMaskModule.forRoot(),
    // MatGoogleMapsAutocompleteModule.forRoot()
  ],
  exports: [],
  providers: [
    DataServiceService,
    MainServiceService,
    AuthGuard,
    AlertService,
    AuthenticationService,
    CamelcaseSpacePipe,
    SafeHtmlPipe,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
