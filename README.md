# ETCD Project

[![Build Status](https://badgen.net/travis/julio-cesar-development/etcd-project?icon=travis)](https://travis-ci.com/julio-cesar-development/etcd-project)
[![GitHub Status](https://badgen.net/github/status/julio-cesar-development/etcd-project)](https://github.com/julio-cesar-development/etcd-project)

> This is a simple API project made with Node, Express, using key-value store with Etcd, running in containers with Docker and deploy with K8S

## Instructions

### Running with Docker

```bash
docker-compose up -d
```

### Running with K8S

```bash
./deploy.sh
# or
kubectl apply -f ./k8s
```

### Running Etcd appart

```bash
export DATA_DIR=data.etcd
export CLUSTER_TOKEN=etcd-cluster
export CLUSTER_STATE=new
export MACHINE_NAME=etcd0
export MACHINE_HOST=0.0.0.0

export CLUSTER="${MACHINE_NAME}=http://${MACHINE_HOST}:2380"

nohup etcd --data-dir=${DATA_DIR} \
  --name ${MACHINE_NAME} \
  --initial-cluster ${CLUSTER} \
  --initial-cluster-state ${CLUSTER_STATE} \
  --initial-cluster-token ${CLUSTER_TOKEN} \
  --listen-peer-urls http://${MACHINE_HOST}:2380 \
  --initial-advertise-peer-urls http://${MACHINE_HOST}:2380 \
  --listen-client-urls http://${MACHINE_HOST}:2379 \
  --advertise-client-urls http://${MACHINE_HOST}:2379

# or, run with a config file in background
export ETCD_CONFIG_FILE=etcd.conf.yaml
nohup etcd --config-file ${ETCD_CONFIG_FILE} &
```
