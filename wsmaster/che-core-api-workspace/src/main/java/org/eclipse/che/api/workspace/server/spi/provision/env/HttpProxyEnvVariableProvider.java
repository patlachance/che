/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.api.workspace.server.spi.provision.env;

import javax.inject.Inject;
import javax.inject.Named;
import org.eclipse.che.api.core.model.workspace.runtime.RuntimeIdentity;
import org.eclipse.che.commons.annotation.Nullable;
import org.eclipse.che.commons.lang.Pair;

/**
 * Provides HTTP_PROXY environment variable with a value set to either http_proxy options from
 * configuration or empty string if http_proxy is not set.
 *
 * @author Patrice Lachance
 */
public class HttpProxyEnvVariableProvider implements EnvVarProvider {

  private final String httpProxy;

  @Inject
  public HttpProxyEnvVariableProvider(
      @Nullable @Named("che.workspace.http_proxy") String httpProxy) {
    this.httpProxy = httpProxy == null ? "" : httpProxy;
  }

  @Override
  public Pair<String, String> get(RuntimeIdentity runtimeIdentity) {
    return Pair.of("HTTP_PROXY", httpProxy);
  }
}
