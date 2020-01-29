FROM mdillon/postgis:11
RUN rm /docker-entrypoint.sh
RUN rm usr/local/bin/docker-entrypoint.sh
COPY docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh /