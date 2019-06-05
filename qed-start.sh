#!/bin/bash
# Execute all shell scripts and commands necessary to run qed kubernetes

DEPLOY="local"
if [ $# -eq 1 ]
then 
	DEPLOY=$1
fi
echo "Deploying for $DEPLOY environment"

python qed_kube_setup.py -d $DEPLOY
sh ./qed-volume-start.sh
sh ./qed-service-start.sh
sh ./qed-deploy-start.sh