#!/bin/bash

set -e

kubectl delete ns etcd-project 2> /dev/null
