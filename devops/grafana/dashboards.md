### 变量设置

1. 进入仪表板，点击 `Edit` 按钮， 然后点击左边的 `Settings`，进入仪表板设置。
2. 点击 `变量` 选项卡，添加 `env` 和 `log_level` 两个变量。

- env
1. Variable type: Query
2. Name: env
3. Data source: Loki
4. Query type: Label values
5. Label: env

- log_level
1. Variable type: Custom
2. Name: log_level
3. Label: 日志级别
4. Values separated by comma: error,warn,info,unknown
5. Selection options: `Multi-value`, Include All option -> Custom all value: `.*`


## 编辑仪表板

1. 点击仪表板右上角的 `竖排的三个点`，弹出菜单，点击 `编辑`。
2. 在面板编辑界面，选择 `查询`（`Queries`）选项卡，点击 `添加查询`（`Add query`）。
3. 切换编辑模式为 `Code`，输入：`{job="odoo17", env="$env"} | json | detected_level=~"$log_level"`
4. 在右上角保存结果。
