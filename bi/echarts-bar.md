## Q&A

我的SmartBI V10版本做交互式仪表盘做柱状图，前端ECharts组件版本是5.1.2。这个很重要，一定记住。
X轴是月份和季度。Y轴是出货金额，单位元。
季度的柱状图，比月份的更宽，把三个月的小柱状条包含在里面，视觉上，每个季度柱状图成为三个月柱状图的背景色。
季度和月份的柱状图分2种颜色，要能清晰展示。
你帮我详细指出每个步骤要怎么做，贴出所有详细的配置和代码


## 调试

https://echarts.apache.org/examples/zh/editor.html?c=bar-simple



## 数据准备

### 数据表和查询语句

数据表设计（DDL）:

```sql
CREATE TABLE craw.ods_cwr_end_shipment_order_detail_nd (
	shipment_detail_id serial4 NOT NULL,
	order_id int4 NOT NULL,
	product_id int4 NOT NULL,
	shipment_date date NOT NULL,
	quantity int4 NULL,
	unit_price numeric(10, 2) NULL,
	total_amount numeric(10, 2) GENERATED ALWAYS AS ((quantity::numeric * unit_price)) STORED NULL,
	status varchar(20) DEFAULT 'shipped'::character varying NULL,
	CONSTRAINT ods_cwr_end_shipment_order_detail_nd_pkey PRIMARY KEY (shipment_detail_id),
	CONSTRAINT ods_cwr_end_shipment_order_detail_nd_quantity_check CHECK ((quantity > 0)),
	CONSTRAINT ods_cwr_end_shipment_order_detail_nd_unit_price_check CHECK ((unit_price >= (0)::numeric))
);
CREATE INDEX idx_shipment_date ON craw.ods_cwr_end_shipment_order_detail_nd USING btree (shipment_date);
```

新建 `数据模型`，新增 `SQL查询`

SQL数据查询语句如下：

```sql
SELECT * FROM (
  SELECT 
    TO_CHAR(shipment_date, 'YYYY-Q') AS quarter_label,
    TO_CHAR(shipment_date, 'YYYY-MM') AS month_label,
    NULL AS quarter_amount, 
    SUM(total_amount) AS month_amount
  FROM craw.ods_cwr_end_shipment_order_detail_nd
  GROUP BY quarter_label, month_label
  UNION ALL
  SELECT 
    TO_CHAR(shipment_date, 'YYYY-Q') AS quarter_label,
    NULL AS month_label,
    SUM(total_amount) AS quarter_amount,
    NULL AS month_amount
  FROM craw.ods_cwr_end_shipment_order_detail_nd
  GROUP BY quarter_label
) AS combined_data
ORDER BY quarter_label, month_label NULLS FIRST
```

### 数据模型层级配置

由于 `SmartBI V10` ​​不支持层级目录整体拖拽​​，需单独绑定字段.

进入 `数据模型`， 在右上角 `维度` 配置中，`新建层次结构`，命名为 `时间层级维度`。

1. 右键点击 quarter_label → ​​生成时间层次​​ → 勾选 ​​“季度”​
2. 右键点击 month_label → ​​生成时间层次​​ → 勾选 ​​“月份”​
3. 在 `时间层级维度` 中，把刚刚生成的时间层次 `季度` 和 `月份` 字段，拖拽进去。注意先后顺序。



## 仪表盘配置

新建 `交互式仪表盘`，命名为 `季度与月份出货金额对比`。

1. 点击左上方 `组件` 按钮，选择 `柱图` 组件，拖拽到画布中。
2. 双击画布上的 `柱状图` 组件，在左上角，点击`数据` 选项卡，选择前面建的 `数据模型`。
3. 在左上角 `维度` 列表中，找到 `时间层级维度`，将 `季度` 和 `月份` 拖拽到右侧的 `列`（`X轴`） 区域。
4. 在左下角 `度量` 列表中，找到 `quarter_amount` 和 `month_amount`，将它们拖拽到右侧的 `行`（`Y轴`） 区域。


自定义属性：

```js
option = {
  title: {
    text: '季度与月份出货金额对比',
    left: 'center'
  },
  legend: {
    data: ['季度出货', '月份出货'],
    bottom: 10
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      let tip = params[0].name.replace('\nQ', '') + '<br/>';
      params.forEach(p => {
        const value = p.value ? p.value.toLocaleString('zh-CN') + '元' : 'N/A';
        tip += `${p.marker} ${p.seriesName}: ${value}<br/>`;
      });
      return tip;
    }
  },
  xAxis: {
    type: 'category',
    data: (this.年月 || []).map(date => {
      // 安全处理月份数据格式
      const month = date.split('-')[1] || date.slice(4, 6);
      const quarterNum = Math.ceil(parseInt(month) / 3);
      return `${month}月\nQ${quarterNum}`;
    }),
    axisLabel: {
      formatter: (val) => {
        const parts = val.split('\n');
        // 季度标签优先显示
        return parts[1] ? `${parts[1]}季度` : parts[0];
      },
      interval: (index) => index % 3 === 0 // 每3个月显示季度标签
    }
  },
  yAxis: {
    type: 'value',
    name: '出货金额(元)'
  },
  series: [{ // 季度系列（宽幅背景）
    name: '季度出货',
    type: 'bar',
    // xAxisIndex: 0, // 绑定月份轴
    barWidth: '20%', // 关键点：宽度≈3个月柱总宽（需微调）
    barGap: '-100%',
    z: 1
  }, { // 月份系列（窄柱前景）
    name: '月份出货',
    type: 'bar',
    // xAxisIndex: 0,
    barWidth: '20%',
    barCategoryGap: '5%',
    barGap: '15%',
    z: 2
  }]
}
```


## 静态ECharts配置

```js
option = {
  title: { text: '季度与月份出货金额对比', left: 'center' },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      const quarterNames = { 0: 'Q1', 1: 'Q2', 2: 'Q3', 3: 'Q4' };
      let tip = params[0].name + '<br/>';
      params.forEach(p => {
        const value = p.value.toLocaleString() + '元';
        const isQuarter = p.seriesName.includes('季度');
        tip += `${p.marker} ${p.seriesName}: ${value}`;
        if (isQuarter) tip += `（${quarterNames[Math.floor(p.dataIndex/3)]}）`;
        tip += '<br/>';
      });
      return tip;
    }
  },
  legend: { data: ['季度出货', '月份出货'], bottom: 10 },
  // 双X轴结构：季度轴（顶部） + 月份轴（底部）
  xAxis: [
    { // 季度轴（居中标签）
      position: 'top',
      type: 'category',
      data: ['Q1', '', '', 'Q2', '', '', 'Q3', '', '', 'Q4', '', ''],
      axisLabel: { 
        interval: 0,
        formatter: (val) => val || '' // 空月份不显示标签
      },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    { // 月份轴（主坐标）
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  ],
  yAxis: { type: 'value', name: '出货金额(元)' },
  grid: { top: 60, bottom: 80, containLabel: true },
  series: [
    { // 季度系列（宽幅背景）
      name: '季度出货',
      type: 'bar',
      xAxisIndex: 1, // 绑定月份轴
      barWidth: '260%', // 关键点：宽度≈3个月柱总宽（需微调）
      barGap: '-100%', // 强制与月份柱重叠[5](@ref)
      stack: '季度', // 堆叠标识（与月份分离）[7](@ref)
      itemStyle: {
        color: 'rgba(100, 180, 255, 0.3)', // 半透明背景
        borderRadius: [6, 6, 0, 0] // 圆角顶部
      },
      // 关键修正：每个季度1个数据点 + 8个null占位
      data: [35000, null, null, 42000, null, null, 38000, null, null, 48000, null, null],
      z: 1
    },
    { // 月份系列（窄柱前景）
      name: '月份出货',
      type: 'bar',
      xAxisIndex: 1,
      barWidth: '50%',
      stack: '月份', // 独立堆叠组[6](@ref)
      itemStyle: { 
        color: '#ff7b5a',
        borderRadius: [3, 3, 0, 0] 
      },
      data: [12000, 10000, 13000, 15000, 14000, 13000, 12000, 14000, 12000, 16000, 15000, 17000],
      z: 2
    }
  ]
};
```