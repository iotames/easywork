#!/bin/bash

SERVICE_NAME="mysvc"
WORKING_DIR=/home/$USER/$SERVICE_NAME
EXEC_START=/home/$USER/$SERVICE_NAME/start.sh

service_file=/etc/systemd/system/$SERVICE_NAME.service
echo "user=$USER, service_file=$service_file"

if [ -f $service_file ]; then
    echo "service file:$service_file exists"
    exit 1
fi

echo "
[Unit]
Description=$SERVICE_NAME
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORKING_DIR
ExecStart=$EXEC_START
Restart=on-failure
Restart=always
RestartSec=10
TimeoutStopSec=15

[Install]
WantedBy=multi-user.target
" > $service_file

systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME
