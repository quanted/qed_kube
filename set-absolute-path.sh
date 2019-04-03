#!/bin/bash
# Modifies the path in qed kubernetes .yml files for volume hostpath
echo "Setting absolute paths for kubernetes volume hostpaths"

pwd=$(pwd)
echo "Current directory path: $pwd"

# Store originals in backups directory
echo "Coping original ymls from backups"
cp -R backups/* .

# Databases
echo "Setting databases paths"
sed -i "" "s|{{PWD}}|$pwd|g" mongodb-persistentVolume1.yml
sed -i "" "s|{{PWD}}|$pwd|g" postgres-persistentVolume1.yml
sed -i "" "s|{{PWD}}|$pwd|g" redis-persistentVolume1.yml

# Nginx
echo "Setting nginx paths"
sed -i "" "s|{{PWD}}|$pwd|g" qed-nginx-deployment.yml

# Django
echo "Setting django paths"
sed -i "" "s|{{PWD}}|$pwd|g" qed-django-deployment.yml
sed -i "" "s|{{PWD}}|$pwd|g" qed-django-persistentVolume1.yml

# Flask
echo "Setting flask paths"
sed -i "" "s|{{PWD}}|$pwd|g" qed-flask-deployment.yml
sed -i "" "s|{{PWD}}|$pwd|g" qed-flask-persistentVolume1.yml

# Celery/Flower
echo "Setting celery/flower paths"
sed -i "" "s|{{PWD}}|$pwd|g" qed-celery-deployment.yml
sed -i "" "s|{{PWD}}|$pwd|g" qed-celery-persistentVolume1.yml
sed -i "" "s|{{PWD}}|$pwd|g" celery-flower-deployment.yml

# HMS
echo "Setting hms paths"
sed -i "" "s|{{PWD}}|$pwd|g" hms-dotnetcore-deployment.yml

# Dask
echo "Setting dask paths"
sed -i "" "s|{{PWD}}|$pwd|g" dask-worker-deployment.yml

# Tomcat
echo "Setting tomcat paths"
sed -i "" "s|{{PWD}}|$pwd|g" qed-tomcat-deployment.yml

echo "All absolute paths set"
exit 0
