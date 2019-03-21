#!/bin/bash
# QED PersistentVolume/Claim Start Script

# Databases
kubectl create -f redis-persistentVolume1.yml
kubectl create -f redis-persistentVolumeClaim1.yml
kubectl create -f mongodb-persistentVolume1.yml
kubectl create -f mongodb-persistentVolumeClaim1.yml

# Celery
kubectl create -f qed-celery-persistentVolume1.yml
kubectl create -f qed-celery-persistentVolumeClaim1.yml

# Flask
kubectl create -f qed-flask-persistentVolume1.yml
kubectl create -f qed-flask-persistentVolumeClaim1.yml

# Django
kubectl create -f qed-django-persistentVolume1.yml
kubectl create -f qed-django-persistentVolumeClaim1.yml