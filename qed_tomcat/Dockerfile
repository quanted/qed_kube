FROM tomcat:7.0-jre8

# Creates "tomcat" user, makes them owner of tomcat app dir
RUN useradd --create-home --shell /bin/bash tomcat && \
	chown -R tomcat:tomcat /usr/local/tomcat

# Makes license folder for chemaxon, gives user read/write privilege
RUN mkdir -p /home/tomcat/.chemaxon/licenses && \
	chmod 764 /home/tomcat/.chemaxon/licenses

# Makes "tomcat" user as owner of chemaxon dir
RUN chown -R tomcat:tomcat /home/tomcat/.chemaxon

# Sets work directory to "tomcat" folder
WORKDIR /home/tomcat

# Sets default user as "tomcat"
USER tomcat
ENV PATH=/:$PATH
COPY tomcat_startup.sh /tomcat_startup.sh
RUN chown -R tomcat:tomcat /tomcat_startup.sh && chmod +x /tomcat_startup.sh
RUN chown -R tomcat:tomcat /tmp/tomcat
ENTRYPOINT ["tomcat_startup.sh"]
CMD ["catalina.sh", "run"]