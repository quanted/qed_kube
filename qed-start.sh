#!/bin/bash
# Execute all shell scripts and commands necessary to run qed kubernetes

sh ./set-absolute-path.sh
sh ./qed-volume-start.sh
sh ./qed-service-start.sh
sh ./qed-deploy-start.sh