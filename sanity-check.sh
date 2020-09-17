#!/usr/bin/env bash

show_help() {
  echo "Usage: ./start.sh"
  echo ""
  echo "-hi or --host-ip set the host ip"
  echo "-hp or --host-port set the host port. Default 4200"
  echo "-h or --help"
}

set_host_ip(){
  SET_HOST_IP=$1
}

set_host_port(){
  export HOST_PORT=$1
}

set_time(){
  export TIME=$1
}

# Defaults
SET_HOST_IP=""
HOST_PORT="8080"
TIME="10000"

while [[ $1 == -* ]]; do
  case "$1" in
    -h|--help|-\?) show_help; exit 0;;
    -hi|--host-ip)  set_host_ip $2; shift 2;;
    -hp|--host-port)  set_host_port $2; shift 2;;
    -t|--time)  set_time $2; shift 2;;
    -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
  esac
done

if [ -n "${SET_HOST_IP}" ];then
  export HOST_IP=${SET_HOST_IP}
else
  echo "No HOST_IP set, try to figure out on its own ..."
fi
echo "HOST_IP: ${HOST_IP}"

echo "Waiting for the content ..."
HOST_IP=$HOST_IP HOST_PORT=$HOST_PORT npm run wait:application
if [ $? == 1 ]; then
  echo "Angular Application is not running check the configuration"
  exit 1
  else 
  echo "Application up and running"
fi

