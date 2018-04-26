class openshift {
  file { "/opt/che/config/openshift":
    ensure => "directory",
    mode   => "755",
  } ->
  file { 'Openshift scritps and descriptors':
   path => '/opt/che/config/openshift/scripts',
   ensure  => "present",
   source => 'puppet:///modules/openshift/scripts',
   mode   => "755",
   recurse => true,
  }
  # creating che.env
  file { "/opt/che/config/openshift/scripts/che-config":
    ensure  => "present",
    content => template("openshift/che-config.erb"),
    mode    => "644",
  }

}
