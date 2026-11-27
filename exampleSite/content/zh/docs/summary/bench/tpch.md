---
title : "TPC-H 测试报告"
menu:
  docs:
    parent: "summary/bench"
    identifier: "summary/bench/tpch"
    weight: 401
---

在 100GB 标准 TPC-H 数据集下，22 条查询全部在亚秒至数秒级完成，多表关联与聚合算子均能充分利用多核向量化执行。
