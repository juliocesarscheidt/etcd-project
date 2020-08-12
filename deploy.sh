#!/bin/bash

set -e

kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: etcd-project
EOF

# ETCD Cluster and ETCD Proxy
kubectl apply -f ./k8s/etcd-cluster.yaml
kubectl apply -f ./k8s/etcd-proxy.yaml

# ETCD app
kubectl apply -f ./k8s/etcd-app.yaml
