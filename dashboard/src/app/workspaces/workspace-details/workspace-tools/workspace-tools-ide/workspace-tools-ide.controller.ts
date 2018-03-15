/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';
import {IPackage, ISearchResults, NpmRegistry} from '../../../../../components/api/npm-registry.factory';
import {IEnvironmentManagerMachine} from '../../../../../components/api/environment/environment-manager-machine';
import {EnvironmentManager} from '../../../../../components/api/environment/environment-manager';

const THEIA_PLUGINS = 'THEIA_PLUGINS';

/**
 * @ngdoc controller
 * @name workspaces.details.tools.controller:WorkspaceDetailsToolsIdeController
 * @description This class is handling the controller for details of workspace ide tool.
 * @author Ann Shumilova
 */
export class WorkspaceToolsIdeController {
  static $inject = ['npmRegistry', 'lodash', 'cheListHelperFactory', '$scope'];
  npmRegistry: NpmRegistry;
  lodash: any;

  packageOrderBy = 'name';
  packages: Array<IPackage>;
  packagesSummary: ISearchResults;
  packagesFilter: any;
  environmentVariables: { [envVarName: string]: string } = {};
  plugins: Array<string>;
  machine: IEnvironmentManagerMachine;
  environmentManager: EnvironmentManager;
  onChange: Function;

  private cheListHelper: che.widget.ICheListHelper;


  /**
   * Default constructor that is using resource
   */
  constructor(npmRegistry: NpmRegistry, lodash: any, cheListHelperFactory: che.widget.ICheListHelperFactory,
              $scope: ng.IScope) {
    this.npmRegistry = npmRegistry;
    this.lodash = lodash;

    const helperId = 'workspace-tools-ide';
    this.cheListHelper = cheListHelperFactory.getHelper(helperId);

    $scope.$on('$destroy', () => {
      cheListHelperFactory.removeHelper(helperId);
    });

    this.packagesFilter = {name: ''};

    this.fetchNPMPackages();

    const deRegistrationFn = $scope.$watch(() => {
      return this.machine;
    }, (machine: IEnvironmentManagerMachine) => {
      if (!this.packages) {
        return;
      }
      this.updatePackages();
    }, true);

    $scope.$on('$destroy', () => {
      deRegistrationFn();
    });
  }

  /**
   * Fetches the list of NPM packages.
   */
  fetchNPMPackages(): void {
    this.npmRegistry.search('keywords:theia-extension').then((data: ISearchResults) => {
      this.packagesSummary = data;
      this.packages = this.lodash.pluck(this.packagesSummary.results, 'package');
      this.updatePackages();
    });
  }

  /**
   * Callback when name is changed.
   *
   * @param str {string} a string to filter projects names
   */
  onSearchChanged(str: string): void {
    this.packagesFilter.name = str;
    this.cheListHelper.applyFilter('name', this.packagesFilter);
  }

  /**
   * Update package information based on UI changes.
   *
   * @param {IPackage} _package
   */
  updatePackage(_package: IPackage): void {
    if (_package.isEnabled) {
      this.plugins.push(_package.name);
    } else {
      this.plugins.splice(this.plugins.indexOf(_package.name), 1);
    }

    this.environmentVariables[THEIA_PLUGINS] = this.plugins.join(',');
    this.environmentManager.setEnvVariables(this.machine, this.environmentVariables);
    this.onChange();
  }

  /**
   * Update the state of packages.
   */
  private updatePackages(): void {
    this.environmentVariables = this.environmentManager.getEnvVariables(this.machine);
    this.plugins = this.machine && this.environmentVariables[THEIA_PLUGINS] ? this.environmentVariables[THEIA_PLUGINS].split(',') : [];

    this.packages.forEach((_package: IPackage) => {
      _package.isEnabled = this.isPackageEnabled(_package.name);
    });
    this.cheListHelper.setList(this.packages, 'name');
  }

  /**
   * Checks whether package is enabled.
   *
   * @param {string} name package's name
   * @returns {boolean} <code>true</code> true if enabled
   */
  private isPackageEnabled(name: string): boolean {
    return this.plugins.indexOf(name) >= 0;
  }
}
