#!/bin/bash

set -e

kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: etcd-project
EOF

# ETCD Cluster
kubectl apply -f ./k8s/etcd-cluster.yaml

# ETCD app
kubectl apply -f ./k8s/etcd-app.yaml
