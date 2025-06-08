## 版本对比与推荐

| **项目**          | Kettle 8.3.0.0-371         | Kettle 9.3.0.0-428   |
|-------------------|----------------------|----------------------|
| **最低 JDK**      | JDK 1.8(Java 8)            | JDK 1.8     |
| **推荐 JDK**      | JDK 1.8(Java 8)            | **JDK 11**      |
| **配置重点**      | 避免 JDK 1.7 冲突          | 推荐 JDK 11 以兼容新特性（如 Hadoop 3.x 集成、Kafka连接器等）  |

- `Kettle 8.3.0.0-371​`: 传统数据库ETL场景​
- `Kettle 9.3.0.0-428​`(pdi-ce-9.3.0.0-428.zip): a. Hadoop/Spark集成场景​: 1. 原生支持Hive 3.x/Spark 3.x实时流. 2. 支持AEL引擎（任务下压Spark集群加速）b.云原生&实时处理场景: 1. 支持容器化部署（Docker/K8s） 2. 集成Kafka/MongoDB实时数据流 3. 适配AWS EMR/Google Dataproc

新项目或需大数据集成 → 选 `Kettle 9.3` + `JDK 11`


### Kettle 9.3和Shims驱动包

若使用 `Kettle 9.3.0.0-428` 仅涉及基础功能（传统数据库ETL），无需额外安装 Shims 驱动包。


---

### ✅ 一、无需 Shims 驱动包的场景（基础功能）
#### **支持的操作（仅依赖 Kettle 默认驱动）**
| **功能类型**       | **具体组件**                             |  
|--------------------|------------------------------------------|  
| **关系型数据库**    | MySQL/Oracle/PostgreSQL/SQL Server/DB2   |  
| **文件处理**        | CSV/Excel/TXT 读写、ZIP压缩              |  
| **基础转换步骤**    | 字段选择、排序、去重、计算器、数据校验   |  
| **作业控制**        | 定时调度、邮件通知、文件检查、Shell脚本  |  

> ⚠️ 注意：连接 **MySQL 8.x/Oracle 19c** 等新版数据库时，需手动将对应JDBC驱动（如 `mysql-connector-java-8.0.30.jar`）放入 `lib` 目录，但这**不属于 Shims 范畴**。

---

### ⚠️ **二、必须 Shims 驱动包的功能（大数据/云服务集成）**
当涉及以下场景时，**必须安装 Shims 驱动包**：  
| **功能类型**         | 依赖 Shims 的具体组件                     | 缺失后果                     |  
|----------------------|-------------------------------------------|------------------------------|  
| **Hadoop 生态**       | HDFS 读写、Hive 输入/输出、Spark 提交     | 作业报错：`No Shim driver available` |  
| **云存储**           | AWS S3、Azure Blob、Google Cloud Storage  | 无法连接云存储桶              |  
| **NoSQL 数据库**     | MongoDB、Cassandra、HBase                 | 转换步骤灰色不可用            |  
| **流处理**           | Kafka 生产/消费、RabbitMQ 消息队列        | 连接器初始化失败              |  
| **大数据文件格式**   | Parquet、Avro、ORC 文件处理               | 文件解析异常                  |  

> 💡 关键识别：若转换中用到 **“Hadoop File Input/Output”** 或 **“Kafka Consumer”** 等步骤，则必须 Shims。

---

### 🔧 **三、Shims 驱动包的最小化安装方案**
若未来可能扩展功能，但当前只需基础ETL，可**仅保留核心驱动**：  
1. 下载官方包：`pentaho-shims-9.3.0.0-428.zip`
2. **仅解压以下必要组件**到 `plugins/pentaho-big-data-plugin`：  
   ```bash
   # 核心层（必选）
   pentaho-hadoop-shims-common-9.3.0.0-428.jar
   pentaho-hadoop-shims-api-9.3.0.0-428.jar
   
   # 云存储支持（按需）
   # pentaho-hadoop-shims-s3-9.3.0.0-428.jar       # AWS S3
   # pentaho-hadoop-shims-azure-9.3.0.0-428.jar    # Azure Blob   
   ```
3. 删除其他无用驱动（如 `cdh6*`, `mapr*` 等集群专用包），减少冲突风险。

---

### 🚫 **四、常见误区：易混淆的非 Shims 依赖**
以下问题**与 Shims 无关**，需单独处理：  
| **报错现象**                     | **真实原因**                  | **解决方案**                     |  
|----------------------------------|-------------------------------|----------------------------------|  
| `No suitable driver found for jdbc:mysql://...` | MySQL 驱动未安装           | 下载 `mysql-connector-java-8.0.30.jar` 放入 `lib` |  
| `Oracle Thin Client missing`     | Oracle 驱动缺失              | 将 `ojdbc8.jar` 加入 `lib`        |  
| `Error parsing XML`              | XML 步骤需 xercesImpl 库     | 添加 `xercesImpl-2.12.0.jar`     |  

---

### 💎 **终极建议**
1. **纯基础ETL场景**：  
   - 直接使用纯净版 Kettle 9.3.0.0-428，**无需 Shims 包**。  
   - 仅需补充所需数据库驱动（MySQL/Oracle等）到 `lib` 目录。  
2. **预留扩展可能性**：  
   - 最小化安装 Shims 核心组件（保留 `common` + `api` + 云驱动），占用 <10MB 空间。  
3. **关键防护**：  
   - 在 `kettle.properties` 中**强制指定连接池类型**，避免泄漏：  
     ```properties
     # 启用防泄漏连接池
     KETTLE_DATABASE_CONNECTION_POOL_TYPE=HikariCP
     KETTLE_DATABASE_HIKARI_LEAK_DETECTION_THRESHOLD=5000
     ```

> 任何组件缺失导致的报错，可通过查看日志中的 `Caused by:` 快速定位——若含 `ClassNotFoundException: org.pentaho.hadoop.shims...` 则为 Shims 问题，否则检查 `lib` 目录驱动。
