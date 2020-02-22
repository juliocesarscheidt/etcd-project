#!/bin/bash

set -e

# (kubectl delete -f ./k8s/ 1> /dev/null 2>&1 &)

# secrets
kubectl apply -f ./k8s/secrets.yaml

# etcd cluster
NUM_PODS=3

for (( i=0 ; i < $NUM_PODS ; i++ )); do
  echo "./k8s/etcd${i}-pod.yaml"
  kubectl apply -f "./k8s/etcd${i}-pod.yaml"
done

kubectl apply -f ./k8s/etcd-svc.yaml

# ingress controller
kubectl apply -f ./k8s/nginx-ingress-controller.yaml

# etcd app
kubectl apply -f ./k8s/etcd-app-deployment.yaml
kubectl apply -f ./k8s/etcd-app-cluster-ip-svc.yaml
kubectl apply -f ./k8s/ingress-service.yaml

# kubectl exec -it etcd0 -- /bin/sh -c "export ETCDCTL_API=3 && etcdctl put foo bar && etcdctl get foo"

# CLUSTER_IP=$(kubectl get svc etcd-client | awk '{print $3}' | tail -1)
# etcdctl --endpoints=http://${CLUSTER_IP}:2379 get foo

