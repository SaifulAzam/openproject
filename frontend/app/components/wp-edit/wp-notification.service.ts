// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

export class WorkPackageNotificationService {

  constructor(protected I18n,
              protected $state,
              protected NotificationsService,
              protected loadingIndicator) { }

  public showSave(workPackage) {
    var message = 'js.notice_successful_' + (workPackage.inlineCreated ? 'create' : 'update');
    this.NotificationsService.addSuccess({
      message: this.I18n.t(message),
      link: {
        target: _ => {
          this.loadingIndicator.mainPage = this.$state.go.apply(this.$state,
                                                                ["work-packages.show.activity",
                                                                 {workPackageId: workPackage.id}]);
        },
        text: this.I18n.t('js.work_packages.message_successful_show_in_fullscreen')
      }
    });
  }

  public showError(errorResource, workPackage) {
    this.showCustomError(errorResource, workPackage) || this.showApiErrorMessages(errorResource);
  }

  public showGeneralError() {
    this.NotificationsService.addError(I18n.t('js.error.internal'));
  }

  private showCustomError(errorResource, workPackage) {
    if (errorResource.errorIdentifier === 'urn:openproject-org:api:v3:errors:PropertyFormatError') {

      let attributeName  = workPackage.schema[errorResource.details.attribute].name;
      let attributeType = workPackage.schema[errorResource.details.attribute].type.toLowerCase();
      let i18nString = 'js.work_packages.error.format.' + attributeType;

      if (this.I18n.lookup(i18nString) === undefined) {
        return false;
      }

      this.NotificationsService.addError(this.I18n.t(i18nString,
                                                     { attribute: attributeName }));

      return true;
    }
    else {
      return false;
    }
  }

  private showApiErrorMessages(errorResource) {
    var messages = errorResource.errorMessages;

    if (messages.length > 1) {
      this.NotificationsService.addError('', messages);
    }
    else {
      this.NotificationsService.addError(messages[0]);
    }

    return true;
  }
}

angular
  .module('openproject')
  .service('WorkPackageNotificationService', WorkPackageNotificationService);
