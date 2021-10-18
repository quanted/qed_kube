#!/bin/bash
set -e
echo "Creating links for mounted volume directories"
ln -s /usr/local/tomcat/.chemaxon/licenses /home/tomcat/.chemaxon/licenses
cp -rf /usr/local/tomcat/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
# rm -rf /usr/local/tomcat/webapps
# ln -s /tmp/tomcat/webapps /usr/local/tomcat

exec "$@"
