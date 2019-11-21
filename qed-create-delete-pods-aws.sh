#!/bin/bash
# QED Deployment/StatefulSet Start Script
cmd=$1

# Databases
kubectl ${cmd} -f redis-deployment.yml
kubectl ${cmd} -f mongodb-statefulset.yml
kubectl ${cmd} -f postgres-statefulset.yml

# CTS
kubectl ${cmd} -f cts-worker-deployment.yml
kubectl ${cmd} -f cts-manager-deployment.yml
kubectl ${cmd} -f cts-nodejs-deployment.yml

# FLASK/CELERY
kubectl ${cmd} -f qed-celery-deployment-aws.yml
kubectl ${cmd} -f qed-flask-deployment-aws.yml

# HMS
kubectl ${cmd} -f hms-dotnetcore-deployment-aws.yml

# Django
kubectl ${cmd} -f qed-django-deployment-aws.yml

# Nginx
kubectl ${cmd} -f qed-nginx-deployment-aws.yml

# Dask
kubectl ${cmd} -f dask-scheduler-deployment.yml
kubectl ${cmd} -f dask-worker-deployment-aws.yml