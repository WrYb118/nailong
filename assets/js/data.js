/* ==========================================================================
   全站内容配置
   --------------------------------------------------------------------------
   日常只需要改这一个文件：上面改个人信息，下面往 ASSIGNMENTS 里加作业。
   文件保存后刷新页面即可，无需任何构建命令。
   ========================================================================== */

/* ---------------- 1. 个人信息 ---------------- */

const SITE = {
  // 显示的名字（中文名或昵称都行），现在先用 GitHub 用户名占位，改成本名即可
  name: "WrYb118",

  // GitHub 用户名：头像、主页链接都靠它
  // 头像会自动从 https://github.com/WrYb118.png 拉取
  handle: "WrYb118",

  // 一句话身份
  tagline: "计算机科学与技术 · 本科在读",

  // 自我介绍，两三句即可
  bio: "这里归档我本科阶段的专业课程作业：实验报告、课程设计、项目源码。按时间倒序排列，支持按课程筛选和关键词搜索。",

  // 自定义头像地址，留空则自动使用 GitHub 头像；再失败就显示姓名首字
  avatar: "",

  // 顶部导航右侧的链接，可自行增删
  links: [
    { label: "GitHub", url: "https://github.com/WrYb118" },
    { label: "邮箱", url: "mailto:you@example.com" },
  ],
};

/* ---------------- 2. 课程清单 ---------------- */
/* key 用短英文，name 是页面上显示的名字，color 是这门课在时间线上的圆点颜色 */

const COURSES = {
  ds: { name: "数据结构", color: "#2C4A7C" },
  os: { name: "操作系统", color: "#7A4E2D" },
  net: { name: "计算机网络", color: "#2F6B57" },
  db: { name: "数据库系统", color: "#6B4A7A" },
  algo: { name: "算法设计与分析", color: "#8A3A3A" },
};

/* ---------------- 3. 作业列表 ---------------- */
/*
   每条作业的字段（除 id / course / title / date 外都可省略）：

   id       唯一标识，随意但别重复
   course   对应上面 COURSES 的 key
   title    作业标题
   date     日期 YYYY-MM-DD，时间线按它倒序排列
   summary  一句话说明
   tags     标签数组
   grade    成绩（可选，显示为角标）
   repo     源码仓库链接（可选）
   files    附件数组，每项 { label, url }
            url 指向 files/ 目录下的文件，例如 "files/ds-hw01.pdf"
            url 也可以填外链，比如网盘或在线文档

   注意：下面 6 条是示例数据，正式使用前删掉或替换成你自己的作业。
*/

const ASSIGNMENTS = [
  {
    id: "ds-hw03",
    course: "ds",
    title: "实验三：二叉搜索树的插入、删除与遍历",
    date: "2026-10-12",
    summary: "用 C++ 实现非递归版 BST，对比递归与非递归实现在深度 10 万节点下的耗时差异。",
    tags: ["C++", "树结构", "性能对比"],
    grade: "96",
    repo: "https://github.com/WrYb118/ds-lab",
    files: [{ label: "实验报告", url: "files/sample-report.pdf" }],
  },
  {
    id: "os-hw02",
    course: "os",
    title: "实验二：进程调度算法模拟",
    date: "2026-09-28",
    summary: "模拟 FCFS、SJF、时间片轮转三种调度策略，输出甘特图并统计平均周转时间。",
    tags: ["Python", "调度算法", "甘特图"],
    files: [
      { label: "实验报告", url: "files/sample-report.pdf" },
      { label: "源码", url: "files/sample-code.zip" },
    ],
  },
  {
    id: "net-hw01",
    course: "net",
    title: "实验一：基于 UDP 的可靠传输协议",
    date: "2026-09-20",
    summary: "在应用层实现停等协议与滑动窗口，模拟丢包与乱序环境验证重传机制。",
    tags: ["Socket", "UDP", "可靠传输"],
    grade: "92",
    repo: "https://github.com/WrYb118/net-lab",
    files: [{ label: "实验报告", url: "files/sample-report.pdf" }],
  },
  {
    id: "db-hw01",
    course: "db",
    title: "课程设计：图书借阅管理系统数据库设计",
    date: "2026-06-15",
    summary: "完成 E-R 建模、三范式规范化、索引设计与 20 条核心 SQL，附存储过程与触发器实现。",
    tags: ["MySQL", "E-R 模型", "课程设计"],
    files: [{ label: "设计文档", url: "files/sample-report.pdf" }],
  },
  {
    id: "algo-hw04",
    course: "algo",
    title: "作业四：动态规划专题",
    date: "2026-05-30",
    summary: "最长公共子序列、背包问题、区间 DP 共 8 题，含复杂度分析与证明。",
    tags: ["动态规划", "复杂度分析"],
    files: [],
  },
  {
    id: "ds-hw01",
    course: "ds",
    title: "实验一：顺序表与链表的实现与比较",
    date: "2026-03-18",
    summary: "分别实现顺序表与单链表，在插入、删除、随机访问三类操作上做时间对比测试。",
    tags: ["C++", "线性表"],
    grade: "94",
    files: [{ label: "实验报告", url: "files/sample-report.pdf" }],
  },
];
