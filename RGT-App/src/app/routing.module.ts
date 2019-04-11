import { UbcTermsConditionsComponent } from './components/cms/ubc-terms-conditions/ubc-terms-conditions.component';
import { UmrahComponent } from './components/cms/umrah/umrah.component';
import { FlightSearchComponent } from './components/flights/flight-search/flight-search.component';
import { NewSectionComponent } from './components/cms/new-section/new-section.component';
import { SectionsComponent } from './components/cms/sections/sections.component';
import { MenuComponent } from './components/cms/menu/menu.component';
import { NewDealComponent } from './components/cms/new-deal/new-deal.component';
import { NewpageComponent } from './components/cms/newpage/newpage.component';
import { TestFormComponent } from './test-form/test-form.component';
import { LoginComponent } from './components/login/login.component';
import { HotelPreviewComponent } from './components/hotel-preview/hotel-preview.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewPropertyComponent } from './components/new-property/new-property.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { AuthGuard } from './guards/index';
import { UsersComponent } from './components/users/users.component';
import { PagesComponent } from './components/cms/pages/pages.component';
import { DealsComponent } from './components/cms/deals/deals.component';
import { VisaComponent } from './components/cms/visa/visa.component';
import { NewVisaComponent } from './components/cms/new-visa/new-visa.component';
import { VisaDetailsComponent } from './components/cms/visa-details/visa-details.component';
import { MasterlistsComponent } from 'app/components/cms/masterlists/masterlists.component';
import { ViewDealsComponent } from 'app/view-deals/view-deals.component';
import { ViewAllScrollerComponent } from 'app/view-all-scroller/view-all-scroller.component';
import { ScrollerComponent } from 'app/scroller/scroller.component';
import { ViewScrollerComponent } from 'app/view-scroller/view-scroller.component';
import { ViewPageComponent } from 'app/view-page/view-page.component';
import { NavbarContentsComponent } from 'app/components/cms/navbar-contents/navbar-contents.component';
import { AirlinesHotelsContentsComponent } from 'app/components/cms/airlines-hotels-contents/airlines-hotels-contents.component';
import { NewAirlineHotelContentsComponent } from 'app/components/cms/new-airline-hotel-contents/new-airline-hotel-contents.component';
import { NewUserComponent } from 'app/components/new-user/new-user.component';
import { DesignCustomPkgComponent } from 'app/components/cms/umrah/design-custom-pkg.component';
import { AddEditHotelComponent } from 'app/components/cms/umrah/add-edit-hotel/add-edit-hotel.component';
import { CallBackQueriesComponent } from 'app/components/cms/call-back-queries/call-back-queries.component';
import { HotelsListComponent } from 'app/components/cms/umrah/hotels-list/hotels-list.component';
import { TransportListComponent } from 'app/components/cms/umrah/transport-list/transport-list.component';
import { FlightsComponent } from 'app/components/cms/flights/flights.component';
import { HotelsComponent } from 'app/components/cms/hotels/hotels.component';
import { TicketReportComponent } from 'app/components/cms/ticket-report/ticket-report.component';

const routes : Routes = [
    {path: "", component: DashboardComponent, canActivate: [AuthGuard]},
    {path: "login", component: LoginComponent},
    {path: "newProperty", component: NewPropertyComponent, canActivate: [AuthGuard]},
    {path: "newProperty/:id", component: NewPropertyComponent, canActivate: [AuthGuard]},
    // Umrah Contents
    {path:"umrah", component: UmrahComponent, canActivate: [AuthGuard]},
    {path: "design-ubc-pkg", component: DesignCustomPkgComponent, canActivate: [AuthGuard]},
    {path: "add-edit-umrah-hotels", component: AddEditHotelComponent, canActivate: [AuthGuard]},
    {path: "add-edit-umrah-hotels/:id", component: AddEditHotelComponent, canActivate: [AuthGuard]},
    {path: "umrah-hotels-list", component: HotelsListComponent, canActivate: [AuthGuard]},
    {path: "umrah-transport", component: TransportListComponent, canActivate: [AuthGuard]},
    {path:"umrah-terms-conditions", component: UbcTermsConditionsComponent, canActivate: [AuthGuard]},
    // Hotels / Property List
    {path: "properties", component: PropertiesComponent, canActivate: [AuthGuard]},
    {path: "hotelPreview/:id", component: HotelPreviewComponent, canActivate: [AuthGuard]},
    {path: "registerUser", component: RegisterUserComponent, canActivate: [AuthGuard]},
    {path: "users", component: UsersComponent, canActivate: [AuthGuard]},
    // CMS
    {path: "pages", component: PagesComponent, canActivate: [AuthGuard]},
    {path: "newPage", component: NewpageComponent, canActivate: [AuthGuard]},
    {path: "deals", component: DealsComponent, canActivate: [AuthGuard]},
    {path: "newDeal", component: NewDealComponent, canActivate: [AuthGuard]},
    {path: "menu", component: MenuComponent, canActivate: [AuthGuard]},
    {path: "visa", component: VisaComponent, canActivate: [AuthGuard]},
    {path: "newVisa", component: NewVisaComponent, canActivate: [AuthGuard]},
    {path: "masterLists", component: MasterlistsComponent, canActivate: [AuthGuard]},
    {path: "sections", component: SectionsComponent, canActivate: [AuthGuard]},
    {path: "newSection", component: NewSectionComponent, canActivate: [AuthGuard]},
    {path: "flightSearch", component: FlightSearchComponent, canActivate: [AuthGuard]},
    {path: "call-back-queries", component: CallBackQueriesComponent, canActivate: [AuthGuard]},
    {path: "testForm", component: TestFormComponent, canActivate: [AuthGuard]},
    {path: "viewVisaDetails/:id", component: VisaDetailsComponent, canActivate: [AuthGuard]},
    {path:"viewDeals/:id", component: ViewDealsComponent, canActivate: [AuthGuard]},
    {path:"scroller", component: ViewAllScrollerComponent, canActivate: [AuthGuard]},
    {path:"newScroller", component: ScrollerComponent, canActivate: [AuthGuard]},
    {path:"viewScroller/:id", component: ViewScrollerComponent, canActivate: [AuthGuard]},
    {path:"addEditUser", component: NewUserComponent, canActivate: [AuthGuard]},
    {path:"viewPage", component: ViewPageComponent, canActivate: [AuthGuard]},
    {path:"navbar-contents", component: NavbarContentsComponent, canActivate: [AuthGuard]},
    {path:"airlines-hotels-contents", component: AirlinesHotelsContentsComponent, canActivate: [AuthGuard]},
    {path:"addEditAirlineHotelContent", component: NewAirlineHotelContentsComponent, canActivate: [AuthGuard]},
    {path:"flight-contents", component: FlightsComponent, canActivate: [AuthGuard]},
    {path:"hotel-contents", component: HotelsComponent, canActivate: [AuthGuard]},
    {path:"ticket-report", component: TicketReportComponent, canActivate: [AuthGuard]},
    {path: "**", component: NotFoundComponent}
]

export const RoutingModule = RouterModule.forRoot(routes);