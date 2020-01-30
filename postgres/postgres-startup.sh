#!/usr/bin/env bash

/bin/sh /docker-entrypoint.sh "$@"
echo
SQL_FILE=$PISCES_DB_FILE
echo "$0: running $SQL_FILE"; psql -U "$POSTGRES_USER" "$POSTGRES_DB" < " $SQL_FILE"; echo