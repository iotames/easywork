## 启动


```bash
docker run -d --name bytebase --restart always --init \
  -e PG_URL=postgresql://user:password@172.16.160.9:5432/bytebase \
  --publish 8000:8080 \
  --volume ./data:/var/opt/bytebase \
  bytebase/bytebase:3.8.0
```
