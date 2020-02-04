#!/bin/bash
set -e

ln -s /tmp/tomcat/.chemaxon/licenses /home/tomcat/.chemaxon/licenses
ln -s /tmp/tomcat/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
ln -s /tmp/tomcat/webapps /usr/local/tomcat/webapps

exec "$@"