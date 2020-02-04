#!/bin/bash
set -e
echo "Creating links for mounted volume directories"
ln -s /tmp/tomcat/.chemaxon/licenses /home/tomcat/.chemaxon/licenses
cp -rf /tmp/tomcat/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
ln -s /tmp/tomcat/webapps /usr/local/tomcat/webapps

exec "$@"