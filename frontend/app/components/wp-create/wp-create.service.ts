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

import {wpServicesModule} from "../../angular-modules";
import {WorkPackageResource} from "../api/api-v3/hal-resources/work-package-resource.service";
import {ApiWorkPackagesService} from "../api/api-work-packages/api-work-packages.service";
import {HalResource} from "../api/api-v3/hal-resources/hal-resource.service";
import {WorkPackageEditModeStateService} from "../wp-edit/wp-edit-mode-state.service";
import {WorkPackageCacheService} from "../work-packages/work-package-cache.service";

export class WorkPackageCreateService {
  protected form: HalResource;

  constructor(protected $q: ng.IQService,
              protected WorkPackageResource: typeof WorkPackageResource,
              protected wpCacheService: WorkPackageCacheService,
              protected apiWorkPackages: ApiWorkPackagesService) {
  }

  public createNewWorkPackage(projectIdentifier) {
    return this.getForm(projectIdentifier).then(form => {
      var wp = this.WorkPackageResource.fromCreateForm(form);
      return wp;
    });
  }

  
  public copyWorkPackage(copyFromForm, projectIdentifier) {
    return this.getForm(projectIdentifier).then(form => {
      var wp = this.WorkPackageResource.copyFrom(copyFromForm, form);
      return wp;
    });
  }

  private getForm(projectIdentifier): ng.IPromise<HalResource> {
    if (!this.form) {
      this.form = this.apiWorkPackages.emptyCreateForm(projectIdentifier);
    }

    return this.form;
  }
}

wpServicesModule.service('wpCreate', WorkPackageCreateService);
