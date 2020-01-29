FROM mdillon/postgis:11
RUN rm /docker-entrypoint.sh
RUN rm usr/local/bin/docker-entrypoint.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENV PATH=/:$PATH