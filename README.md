Local Kubernetes Development Guide
----------------------------------

### Introduction

This guide is to provide a detailed description for setting up all the tools needed to start the developing with kubernetes locally. Kubernetes is able to run in various different environments, zones, that each require a slightly different configuration and tools. For local development, we will be using a combination of tools that will host a deployed instance of a single node kubernetes cluster. Specifically, we will be using Minikube, VirtualBox and Docker.

Official Kubernetes Documentation: [here](https://www.google.com/url?q=https://kubernetes.io/docs&sa=D&ust=1551987821373000)

### Terminology

*   Node - The worker machine, vm or physical machine
*   Pod - Smallest deployable unit, a container, in our case a Docker container. For horizontal scaling, the best container design pattern is the “one-container-per-pod” model.
*   Replica Set - Controls the currently available number of pods, should one fail the Replica Set will create another pod so that the specified number of pods is maintained.
*   Deployment - Manages Pods and sets a Replica Set.
*   Service - Abstraction that defines a logical set of Pods and their access policies
*   Storage Class - Allows for declaration of ‘classes’ of storage
*   Persistent Volume Claim - Abstraction of the Storage Class and is used by a Pod to mount a Volume.
*   Statefulset - Similar to a Deployment, but maintains state for using persistent storage 

### Requirements

*   Docker - [https://www.docker.com/get-started](https://www.google.com/url?q=https://www.docker.com/get-started&sa=D&ust=1551987821375000)

*   Kubernetes (kubernetes cli) - [https://kubernetes.io/docs/tasks/tools/install-kubectl/](https://www.google.com/url?q=https://kubernetes.io/docs/tasks/tools/install-kubectl/&sa=D&ust=1551987821376000)

*   Requires [Go](https://www.google.com/url?q=https://golang.org/doc/install&sa=D&ust=1551987821376000) if compiling from source.

*   Minikube - [https://kubernetes.io/docs/tasks/tools/install-minikube/](https://www.google.com/url?q=https://kubernetes.io/docs/tasks/tools/install-minikube/&sa=D&ust=1551987821376000)

*   We will be using VirtualBox, though minikube does support Hyper-V the steps completed below were done on a Mac with VirtualBox, due to virtualization restrictions.

*   VirtualBox - [https://www.virtualbox.org/](https://www.google.com/url?q=https://www.virtualbox.org/&sa=D&ust=1551987821377000)

A useful tool for generating kubernete .yml files from a docker-compose file (but not required for this wiki):
*   Kompose.io - [https://github.com/kubernetes/kompose](https://www.google.com/url?q=https://github.com/kubernetes/kompose&sa=D&ust=1551987821377000)

### Minikube

Minikube is tool for locally deploying a single node kubernetes cluster, and while not the same as a server or cloud deploy, does provide a way for development and or testing from a local computer. [Official github repo](https://www.google.com/url?q=https://github.com/kubernetes/minikube&sa=D&ust=1551987821378000).

Once all prerequisites for minikube are installed, setup is quite simple and should only require
```shell
$ minikube start
```
Once successful, this will start up a new virtual machine for minikube and update the configuration settings for kubernetes. If wanting to use Hyper-V, the virtual machine driver can be specified along with the virtual network switch as shown below
```shell
$ minikube start --vm-driver hyperv --hyperv-virtual-switch “MY\_VIRTUAL\_SWITCH”
```
This will attempt to build the virtual machine in Hyper-V, using a virtual switch that must be setup prior to this. Details about Hyper-V virtual switches can be found [here](https://www.google.com/url?q=https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines&sa=D&ust=1551987821380000).

The virtual machine name for minikube can also be changed from the default minikube using the \-p flag
```shell
$ minikube start -p my-minikube
```

### Kompose

Kompose.io is a kubernetes product for converting a docker-compose file into yml files that can be consumed by kubectl or directly standing up the docker-compose orchestration as kubernetes. [Official github repo](https://www.google.com/url?q=https://github.com/kubernetes/kompose&sa=D&ust=1551987821382000).

To convert a docker-compose.yml, simply provide the file as an argument to kompose
```shell
$ kompose convert -f ./docker-compose.yml
```
This conversion will use default values for replicas and volumes, set to 1 and “persistentVolumeClaim”. Both options can be set in the conversion using
```shell
$ kompose convert -f ./docker-compose.yml --replicas 3 --volumes “hostPath”
```
Using hostPathvolumes require that the volume directory is located in the repo path as specified in the docker-compose.yml. Any data in volumes using hostPathwill not persist beyond the life of the volume node. Wanting persistent data with kubernetes requires a persistentVolumenode and persistentVolumeClaim for each deployment that uses the persistent volume.

Note: kompose convert does not generate volumes, with the exception of hostPath, emptyDir, and persistentVolumeClaim.If using a persistentVolumeClaim,the corresponding persistentVolume will need to be generated from kubectl or a kubernetes yml file.

The other kompose command allows us to stand up the docker-compose.yml located in the current directory
```shell
$ kompose up
```
Like convert, up allows for replicas and volumes to be specified
```shell
$ kompose up -f ./docker-compose.yml --replicas 3 --volumes “hostPath”
```
Kompose up by default will attempt to build and push the docker images to a docker registry, the docker registry is specified in the docker-compose or kubenetes yml container image value. Example: “quanted/qed\_django:latest” will attempt to be pushed to the docker.io quanted repo for qed\_django tagged as latest. When using a 3rd party docker image, like mongodb, this is a problem due to not having access to the mongodb docker.io registry. There are two solutions to this issue; one we build and store all docker images under quanted on docker hub, which would be ideal for a production deploy, or two we set up a private localhost docker registry that we can push to, ideal for development and testing.

To setup a localhost docker registry, we can use the [official docker-registry image](https://www.google.com/url?q=https://github.com/docker/docker.github.io/blob/master/registry/deploying.md&sa=D&ust=1551987821387000) and simply run the docker image locally
```shell
$ docker run -d -p 5000:5000 --restart=always --name registry registry:2
```
Now if we change the image repo location to localhost:5000/qed\_django the docker image will be pushed to our local registry instead of docker.io .

For macOS additional changes to ~/.docker/conf.json may be required for authentication due to issues with docker and the mac password keychain.

Changing the image repo location is not ideal for static, or production images, as those should already be stored on docker.io, but for testing and development of new features/images.

Note: Kompose only supports the major docker-compose versions (‘1.0’, ‘2.0’, and ‘3.0’) and there is no intention, at this point, of providing further support for docker-compose beyond version 3.0.

### Kubectl


\[Kubernetes command line tool details to be added soon\]

### QED Kubernetes

Kubernetes offers many different design patterns for orchestrating containers. For simplicity and scalability, we will employ the single-container-per-pod design. What this means is that each docker container will be placed in it’s own Deployment. In kubernetes a Deployment describes a desired state where ReplicaSets and Pods are defined.

In terms of docker-compose, a Deployment can be used to specify a docker-compose service, it’s image and build context, desired quantity of containers (Pods). Containers that are accessed from an external process, or Deployment in this case, also require a Service, which specifies how the Deployment can be accessed, ports and target ports.

With this in mind, the structure for QED in kubernetes could take several forms but the following setup is the design for current development.

#### Kubernetes QED Files

*   Nginx
    *   qed-nginx-service.yml (defines access using port 80, 443, and 7777)
    *   qed-nginx-deployment.yml (defines container)
        *   hostPath volume for certs and static files
*   Django
    *   qed-django-service.yml (defines access to port 8080)
    *   qed-django-deployment.yml (defines container)
        *   hostPath volumes for secrets, collected_static, temp_config, static_qed and templates_qed
    *   qed-django-persistentVolumeClaim.yml (for accessing persistent database files)
*   Flask
    *   qed-flask-service.yml (defines access to port 8080)
    *   qed-flask-deployment.yml (defines container)
        *   hostPath volumes for collected_static, sam and qed-basins data
    *   qed-flask-persistentVolumeClaim.yml (for accessing persistent database files)
*   Celery
    *   qed-celery-deployment.yml (defines container)
        *   hostPath volumes for collected_static, sam and qed-basins data
    *   qed-celery-persistentVolumeClaim.yml (for accessing persistent database files)
*   Celery
    *   celery-flower-service.yml (defines access to port 5555)
    *   celery-flower-deployment.yml (defines container)
*   CTS-NodeJS (Not tested)
    *   cts-nodejs-service.yml (defines access to port 4000)
    *   cts-nodesj-deployment.yml (defines container)
*   CTS-Manager (Not tested)
    *   cts-manager-deployment.yml (defines container)
*   CTS-Worker (Not tested)
    *   cts-worker-deployment.yml (defines container)
*   Redis
    *   redis-service.yml (defines access to port 6379)
    *   redis-deployment.yml (defines container)
    *   redis-persistentVolumeClaim.yml
*   MongoDB
    *   mongodb-service.yml (defines access to port 27017)
    *   mongodb-statefulset.yml (defines container)
    *   mongodb-persistentVolumeClaim.yml
*   HMS
    *   hms-dotnetcore-service.yml (defines access to port 80)
    *   hms-dotnetcore-deployment.yml (defines container)
        *   hostPath volume for App_Data and database files
*   Dask-Scheduler
    *   dask-scheduler-service.yml (defines access to port 8786 and 8787)
    *   dask-scheduler-deployment.yml (defines container)
*   Dask-Worker
    *   qed-dask-worker-deployment.yml (defines container)
        *   hostPath volume for qed
*   Tomcat (not tested)
    *   qed-tomcat-service.yml (defines access to port 80:8080)
    *   qed-tomcat-deployment.yml (defines container)
        *   hostPath volumes for secrets, license and webapp data
*   Postgres
    *   postgres-service.yml (defines access to port 5432)
    *   postgres-statefulset.yml (defines container)
    *   postgres-persistentVolumeClaim.yml
*   Volumes
    *   qed-django-persistentVolume.yml (persistentVolume)
    *   qed-flask-persistentVolume.yml (persistentVolume)
    *   qed-celery-persistentVolume.yml (persistentVolume) 
    *   redis-persistentVolume.yml (persistentVolume)
    *   mongodb-persistentVolume.yml (persistentVolume)
    *   postgres-persistentVolume.yml (persistentVolume)

        
#### Docker Builds
| Deployment | Docker Image | Build Status |
| ---------- | ------------ | ------------ | 
| qed-nginx-deployment.yml | [quanted/qed_nginx](https://cloud.docker.com/u/quanted/repository/docker/quanted/qed_nginx) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/qed_nginx.svg) |
| qed-django-deployment.yml | [quanted/qed-django](https://cloud.docker.com/u/quanted/repository/docker/quanted/qed-django) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/qed-django.svg) |
| qed-flask-deployment.yml | [quanted/flask_qed](https://cloud.docker.com/u/quanted/repository/docker/quanted/flask_qed) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/flask_qed.svg) |
| qed-celery-deployment.yml | [quanted/flask_qed](https://cloud.docker.com/u/quanted/repository/docker/quanted/flask_qed) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/flask_qed.svg) |
| cts-nodejs-deployment.yml | [quanted/cts_nodejs](https://cloud.docker.com/u/quanted/repository/docker/quanted/cts_nodejs) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/cts_nodejs.svg) |
| cts-celery-deployment.yml | [quanted/cts_celery](https://cloud.docker.com/u/quanted/repository/docker/quanted/cts_celery) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/cts_celery.svg) |
| cts-worker-deployment.yml | [quanted/cts_celery](https://cloud.docker.com/u/quanted/repository/docker/quanted/cts_celery) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/cts_celery.svg) |
| redis-deployment.yml | [quanted/redis](https://cloud.docker.com/u/quanted/repository/docker/quanted/redis) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/redis.svg) |
| mongodb-deployment.yml | [quanted/mongo](https://cloud.docker.com/u/quanted/repository/docker/quanted/mongo) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/mongo.svg) |
| hms-dotnetcore-deployment.yml | [quanted/hms-dotnetcore](https://cloud.docker.com/u/quanted/repository/docker/quanted/hms-dotnetcore) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/hms-dotnetcore.svg) |
| dask-scheduler-deployment.yml | [quanted/qed-dask](https://cloud.docker.com/u/quanted/repository/docker/quanted/qed-dask) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/qed-dask.svg) |
| dask-worker-deployment.yml | [quanted/qed-dask](https://cloud.docker.com/u/quanted/repository/docker/quanted/qed-dask) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/qed-dask.svg) |
| qed-tomcat-deployment.yml | [quanted/tomcat](https://cloud.docker.com/u/quanted/repository/docker/quanted/qed-tomcat) | ![Docker Build Status](https://img.shields.io/docker/cloud/build/quanted/qed-tomcat.svg) |
| postgres-deployment.yml | [mdillon/postgis](https://hub.docker.com/r/mdillon/postgis) | ![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/mdillon/postgis.svg) |
