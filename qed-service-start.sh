#!/bin/bash
# QED Kubernetes Service Start Script

# Databases
kubectl create -f redis-service.yml
kubectl create -f mongodb-service.yml

# CTS
kubectl create -f cts-nodejs-service.yml

# FLASK/CELERY
kubectl create -f qed-flask-service.yml

# HMS
kubectl create -f hms-dotnetcore-service.yml

# Django
kubectl create -f qed-django-service.yml

# Nginx
kubectl create -f qed-nginx-service.yml