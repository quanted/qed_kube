#!/bin/bash
# QED Deployment/StatefulSet Start Script

# Databases
kubectl create -f redis-deployment.yml
kubectl create -f mongodb-statefulset.yml

# CTS
kubectl create -f cts-worker-deployment.yml
kubectl create -f cts-manager-deployment.yml
kubectl create -f cts-nodejs-deployment.yml

# FLASK/CELERY
kubectl create -f qed-celery-deployment.yml
kubectl create -f qed-flask-deployment.yml

# HMS
kubectl create -f hms-dotnetcore-deployment.yml

# Django
kubectl create -f qed-django-deployment.yml

# Nginx
kubectl create -f qed-nginx-deployment.yml