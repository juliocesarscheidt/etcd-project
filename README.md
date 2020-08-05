# ETCD Project

[![Build Status](https://travis-ci.org/julio-cesar-development/etcd-project.svg)](https://travis-ci.org/julio-cesar-development/etcd-project)
[![GitHub Status](https://badgen.net/github/status/julio-cesar-development/etcd-project)](https://github.com/julio-cesar-development/etcd-project)
![License](https://badgen.net/badge/license/MIT/blue)

> This is a simple API project made with Node, Express, using key-value store with ETCD, running in containers with Docker and deploy with K8S

## Instructions

### About ETCD

- ETCD is an open source distributed key-value store that uses Raft Consensus Algorithm, written in Go.
  [[GitHub](https://github.com/etcd-io/etcd)]
  [[Docs](https://etcd.io/docs/v3.4.0/)]

### Running with Docker

```bash
docker-compose up -d
```

### Running with K8S

```bash
chmod +x deploy.sh && \
    bash deploy.sh
```

### Running Etcd appart

```bash
export DATA_DIR=data.etcd
export CLUSTER_TOKEN=etcd-cluster
export CLUSTER_STATE=new
export MACHINE_NAME=etcdserver
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
