<?php

// LDAP variables
$ldaphost = "hqpdgad03.myijm.net";  // your ldap servers
$ldapport = 389;                 // your ldap server's port number

// Connecting to LDAP
$ldapconn = ldap_connect($ldaphost, $ldapport)
          or die("Could not connect to $ldaphost");

?>
