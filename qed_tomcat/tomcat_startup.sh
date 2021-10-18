#!/bin/bash
set -e
echo "Creating links for mounted volume directories"
ln -s /mnt/tomcat/.chemaxon/licenses /home/tomcat/.chemaxon/licenses
cp -rf /mnt/tomcat/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml

#echo "/usr/local/tomcat directory contents"
#ls /usr/local/tomcat
#
#echo "original /usr/local/tomcat/webapps"
#ls /usr/local/tomcat/webapps

rm -rf /usr/local/tomcat/webapps
#mkdir /usr/local/tomcat/webapps
ln -s /mnt/tomcat/webapps /usr/local/tomcat/webapps

echo "Syn link /usr/local/tomcat/webapps"
ls /usr/local/tomcat/webapps
chown -R tomcat:tomcat /usr/local/tomcat/webapps

exec /usr/local/tomcat/bin/catalina.sh run
#exec "$@"
