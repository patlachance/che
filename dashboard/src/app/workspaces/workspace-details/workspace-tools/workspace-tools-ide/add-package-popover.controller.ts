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

/**
 * This class is handling the controller for adding the new package.
 *
 * @author Ann Shumilova
 */
export class AddPackagePopoverController {
  onAddPackage: Function;
  /**
   * Popover is open when <code>true</code>.
   */
  private isOpen: boolean;
  private packageName: string;
  private packageLocation: string;

  constructor() {
    this.isOpen = false;
    this.packageName = '';
    this.packageLocation = '';
  }

  addPackage(): void {
    this.onAddPackage({ 'name': this.packageName, 'location': this.packageLocation});
    this.close();
  }

  close(): void {
    this.isOpen = false;
    this.packageName = '';
    this.packageLocation = '';
  }
}
