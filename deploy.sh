#!/bin/bash

set -e

NUM_PODS=3

for (( i=0 ; i < $NUM_PODS ; i++ )); do
  echo "./k8s/etcd$i-pod.yaml"
  kubectl apply -f "./k8s/etcd${i}-pod.yaml"
done

kubectl apply -f ./k8s/etcd-svc.yaml


# kubectl exec -it etcd0 -- /bin/sh -c "export ETCDCTL_API=3 && etcdctl put foo bar && etcdctl get foo"

# CLUSTER_IP=$(kubectl get svc etcd-client | awk '{print $3}' | tail -1)
# etcdctl --endpoints=http://${CLUSTER_IP}:2379 get foo

