FROM mdillon/postgis:11

RUN rm /docker-entrypoint.sh
RUN rm usr/local/bin/docker-entrypoint.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV PATH=/:$PATH

COPY postgres-startup.sh /postgres-startup.sh
RUN chmod +x /postgres-startup.sh

ENTRYPOINT ["postgres-startup.sh"]
CMD ["postgres"]