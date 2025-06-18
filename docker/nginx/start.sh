#!/bin/bash

docker run --network host --name nginx \
--restart always \
-d \
-v ./conf.d:/etc/nginx/conf.d \
-v ./nginx.conf:/etc/nginx/nginx.conf \
-v ./ssl:/ssl \
-v ./logs:/var/log/nginx \

nginx:1.28

# ports:
#     - "80:80"
#     - "443:443"
# volumes:
#     - ${WWW_DIR}:/www/:rw
#     - ./nginx/ssl:/ssl:rw
#     - ./nginx/conf.d:/etc/nginx/conf.d/:rw
#     - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
#     - ./logs/nginx:/var/log/nginx/:rw
