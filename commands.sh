#!/bin/bash

# get current context and set the namespace
export CONTEXT=$(kubectl config current-context)
export NAMESPACE=etcd-project

kubectl config set-context ${CONTEXT} --namespace=${NAMESPACE}

kubectl get pod,deploy,svc,ingress -n ${NAMESPACE}

kubectl logs -f deploy/etcd-app -n ${NAMESPACE}

# kubectl exec -it "$(kubectl get pod -n ${NAMESPACE} | grep "etcd-deployment" | head -n 1 | cut -d' ' -f1)" -- /bin/sh -c "curl http://localhost:8200/api/v1/healthcheck"
# kubectl logs -f "$(kubectl get pod -n ${NAMESPACE} | grep "etcd-deployment" | head -n 1 | cut -d' ' -f1)"

# kubectl exec -it etcd0 -- /bin/sh -c "export ETCDCTL_API=3 && etcdctl put KEY_NAME KEY_VALUE && etcdctl get KEY_NAME"

# CLUSTER_IPS=$(kubectl get svc | egrep "^etcd[0-9]" | awk '{print $3}' | xargs -I {} sh -c "echo http://{}:2379" | tr -s '\n' ',' | sed 's/,$//gm')
# echo ${CLUSTER_IPS}

# see info about the cluster
kubectl exec -it etcd0 -- /bin/sh -c "export ETCDCTL_API=3 && etcdctl --endpoints="etcd0:2379,etcd1:2379,etcd2:2379" --write-out=table endpoint status"
# +-------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+
# |     ENDPOINT      |        ID        | VERSION | DB SIZE | IS LEADER | IS LEARNER | RAFT TERM | RAFT INDEX | RAFT APPLIED INDEX | ERRORS |
# +-------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+
# | http://etcd0:2379 | cf1d15c5d194b5c9 |   3.4.3 |   82 kB |     false |      false |         2 |        238 |                238 |        |
# | http://etcd1:2379 | ade526d28b1f92f7 |   3.4.3 |   74 kB |      true |      false |         2 |        238 |                238 |        |
# | http://etcd2:2379 | d282ac2ce600c1ce |   3.4.3 |   74 kB |     false |      false |         2 |        238 |                238 |        |
# +-------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+

# start etcd gateway
# kubectl exec -it etcd0 -- /bin/sh -c "etcd gateway start --endpoints=etcd0:2379,etcd1:2379,etcd2:2379"

# gRPC Proxy
kubectl run -it -n default etcd --rm \
    --env ALLOW_NONE_AUTHENTICATION="yes" \
    --image=bitnami/etcd:3-debian-10 \
    --restart=Never -- sh -c \
    "etcd grpc-proxy start --endpoints=etcd0:2379,etcd1:2379,etcd2:2379 --listen-addr=0.0.0.0:2379"

kubectl run -it -n default etcd --rm --env ALLOW_NONE_AUTHENTICATION="yes" --image=bitnami/etcd:3-debian-10 --restart=Never -- sh
etcd grpc-proxy start --endpoints=etcd0:2379,etcd1:2379,etcd2:2379 --listen-addr=0.0.0.0:2379

kubectl exec -it pod/etcd-proxy -n etcd-project -- sh
kubectl exec -it pod/etcd0 -n etcd-project -- sh

ETCDCTL_API=3 && etcdctl --endpoints="etcd0:2379,etcd1:2379,etcd2:2379" --write-out=table endpoint status
ETCDCTL_API=3 && etcdctl --endpoints="etcd0:2379,etcd1:2379,etcd2:2379" --write-out=table member list
