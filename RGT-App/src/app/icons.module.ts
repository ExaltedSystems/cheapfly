import { NgModule } from '@angular/core';
import { IconUser, IconGlobe, IconDollarSign, IconMapPin, IconCalendar, IconUsers, IconPlus, IconEdit3,
  IconChevronDown, IconMinus, IconSend, IconAward, IconXCircle, IconMenu, IconPhoneCall, IconClock, IconPlusCircle, IconBell,
  IconSliders, IconSearch, IconArrowRight, IconCheck, IconFacebook, IconTwitter, IconInstagram, IconLinkedin, IconHome, IconDelete } from 'angular-feather';

const icons = [
  IconUser, IconGlobe, IconDollarSign, IconMapPin, IconCalendar, IconUsers, IconPlus, IconEdit3,
  IconChevronDown, IconMinus, IconSend, IconAward, IconXCircle, IconMenu, IconPhoneCall, IconClock, IconPlusCircle, IconBell,
  IconSliders, IconSearch, IconArrowRight, IconCheck, IconFacebook, IconTwitter, IconInstagram, IconLinkedin, IconHome, IconDelete 
];

@NgModule({
  imports: icons,
  exports: icons
})
export class IconsModule { }