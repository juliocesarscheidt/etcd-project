# ETCD Project

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
export DATA_DIR="data.etcd"
export CLUSTER_TOKEN="TOKEN"
export CLUSTER_STATE="new"
export CLUSTER_NAME="etcdserver"
export LISTEN_ADDR="http://0.0.0.0:2380"

export CLUSTER="${CLUSTER_NAME}=${LISTEN_ADDR}"

nohup etcd --data-dir=${DATA_DIR} \
  --name ${CLUSTER_NAME} \
  --initial-cluster ${CLUSTER} \
  --initial-cluster-state ${CLUSTER_STATE} \
  --initial-cluster-token ${CLUSTER_TOKEN} \
  --listen-peer-urls ${LISTEN_ADDR} \
  --initial-advertise-peer-urls ${LISTEN_ADDR} \
  --listen-client-urls http://0.0.0.0:2379 \
  --advertise-client-urls http://0.0.0.0:2379 \
  --debug=false \
  --auto-tls=false \
  --peer-auto-tls=false \
  --enable-pprof=false \
  --metrics=basic \
  --auth-token=simple \
  --auto-compaction-retention=6 \
  --enable-v2=true \
  --force-new-cluster=false


# or, run with a config file in background
export ETCD_CONFIG_FILE=./etcd/etcd.conf.yaml
nohup etcd --config-file ${ETCD_CONFIG_FILE} &
```
