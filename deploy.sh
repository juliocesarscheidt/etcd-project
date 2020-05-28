#!/bin/bash

set -e

# (kubectl delete -f ./k8s/ 1> /dev/null 2>&1 &)

# get current context and set the namespace
# export CONTEXT=$(kubectl config view | awk '/current-context/ {print$ 2}')
# export NAMESPACE=development

# kubectl config set-context ${CONTEXT} --namespace=${NAMESPACE}

CURRENT_NAMESPACE=$(kubectl config get-contexts | grep "*" | tr -s '\t' ' ' | cut -d " " -f 5)
echo "${CURRENT_NAMESPACE}"

# namespace
kubectl apply -f ./k8s/namespace.yaml

# quota
# kubectl apply -f ./k8s/resourcequota.yaml

# secrets
kubectl apply -f ./k8s/secrets.yaml

# nginx ingress controller
# kubectl apply -f ./k8s/nginx-ingress-controller.yaml
# kubectl get pod,deploy,svc,ep -n ingress-nginx

# etcd app
kubectl apply -f ./k8s/etcd-app-deployment.yaml
kubectl apply -f ./k8s/etcd-app-cluster-ip-svc.yaml
# kubectl apply -f ./k8s/etcd-app-hpa.yaml
# ingress svc
kubectl apply -f ./k8s/ingress-service.yaml

# etcd cluster
NUM_PODS=3

for (( i=0 ; i < $NUM_PODS ; i++ )); do
  echo "./k8s/etcd${i}-pod.yaml"
  kubectl apply -f "./k8s/etcd${i}-pod.yaml"
done

kubectl apply -f ./k8s/etcd-svc.yaml

# kubectl exec -it etcd0 -- /bin/sh -c "export ETCDCTL_API=3 && etcdctl put KEY_NAME KEY_VALUE && etcdctl get KEY_NAME"

# CLUSTER_IPS=$(kubectl get svc | egrep "^etcd[0-9]" | awk '{print $3}' | xargs -I {} sh -c "echo http://{}:2379" | tr -s '\n' ',' | sed 's/,$//gm')
# echo ${CLUSTER_IPS}

# see info about the cluster
# kubectl exec -it etcd0 -- /bin/sh -c "export ETCDCTL_API=3 && etcdctl --endpoints="http://etcd0:2379,http://etcd1:2379,http://etcd2:2379" --write-out=table endpoint status"
# +-------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+
# |     ENDPOINT      |        ID        | VERSION | DB SIZE | IS LEADER | IS LEARNER | RAFT TERM | RAFT INDEX | RAFT APPLIED INDEX | ERRORS |
# +-------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+
# | http://etcd0:2379 | cf1d15c5d194b5c9 |   3.4.3 |   82 kB |     false |      false |         2 |        238 |                238 |        |
# | http://etcd1:2379 | ade526d28b1f92f7 |   3.4.3 |   74 kB |      true |      false |         2 |        238 |                238 |        |
# | http://etcd2:2379 | d282ac2ce600c1ce |   3.4.3 |   74 kB |     false |      false |         2 |        238 |                238 |        |
# +-------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+

# start etcd gateway
# kubectl exec -it etcd0 -- /bin/sh -c "etcd gateway start --endpoints=http://etcd0:2379,http://etcd1:2379,http://etcd2:2379"
