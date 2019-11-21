#!/bin/bash
# QED PersistentVolume/Claim Start Script

kubectl create -f app-data-persistentVolumeClaim1-aws.yml
kubectl create -f collected-static-persistentVolumeClaim1-aws.yml
kubectl create -f django-secrets-persistentVolumeClaim1-aws.yml
kubectl create -f hms-dotnetcore-appdata-persistentVolumeClaim1-aws.yml
kubectl create -f mongodb-persistentVolumeClaim1-aws.yml
kubectl create -f postgres-persistentVolumeClaim1-aws.yml
kubectl create -f qed-django-persistentVolumeClaim1-aws.yml
kubectl create -f qed-nginx-certs-persistentVolumeClaim1-aws.yml
kubectl create -f qed-static-persistentVolumeClaim1-aws.yml
kubectl create -f qed-templates-persistentVolumeClaim1-aws.yml
kubectl create -f qed-tomcat-config-persistentVolumeClaim1-aws.yml
kubectl create -f redis-persistentVolumeClaim1-aws.yml