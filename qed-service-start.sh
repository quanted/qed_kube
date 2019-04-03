#!/bin/bash
# QED Kubernetes Service Start Script

# Databases
kubectl create -f redis-service.yml
kubectl create -f mongodb-service.yml
kubectl create -f postgres-service.yml

# CTS
kubectl create -f cts-nodejs-service.yml

# FLASK
kubectl create -f qed-flask-service.yml
kubectl create -f celery-flower-service.yml

# Dask
kubectl create -f dask-scheduler-service.yml

# HMS
kubectl create -f hms-dotnetcore-service.yml

# Django
kubectl create -f qed-django-service.yml

# Nginx
kubectl create -f qed-nginx-service.yml