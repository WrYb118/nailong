/* ==========================================================================
   页面渲染逻辑
   数据全部来自 data.js，这里只负责「读数据 → 生成 DOM」。
   想改样式去 style.css，想改内容去 data.js，一般不用动这个文件。
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 小工具 ---------- */

  const $ = (sel) => document.querySelector(sel);

  // 把用户填的文本转义，避免 < > 之类字符破坏 HTML 结构
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const parseDate = (str) => {
    const d = new Date(String(str) + "T00:00:00");
    return isNaN(d) ? new Date(0) : d;
  };

  const pad = (n) => String(n).padStart(2, "0");

  const fmtDate = (d) => d.getFullYear() + "." + pad(d.getMonth() + 1) + "." + pad(d.getDate());

  const initials = (name) => {
    const t = String(name || "").trim();
    if (!t) return "·";
    // 中文取首字，英文取首字母
    return /^[\u4e00-\u9fa5]/.test(t) ? t.slice(0, 1) : t.slice(0, 2).toUpperCase();
  };

  /* ---------- 顶部：头像 / 姓名 / 简介 / 链接 ---------- */

  function renderHeader() {
    document.title = SITE.name + " · 课程作业";
    $("#brand-name").textContent = SITE.name;
    $("#hero-name").textContent = SITE.name;
    $("#tagline").textContent = SITE.tagline || "";
    $("#bio").textContent = SITE.bio || "";

    // 头像：自定义 > GitHub 头像 > 姓名首字
    const box = $("#avatar");
    const src = SITE.avatar || (SITE.handle ? "https://github.com/" + encodeURIComponent(SITE.handle) + ".png?size=200" : "");

    if (src) {
      const img = document.createElement("img");
      img.alt = SITE.name + " 的头像";
      img.src = src;
      img.addEventListener("error", () => {
        box.textContent = initials(SITE.name);
        box.removeAttribute("aria-hidden");
      });
      box.appendChild(img);
    } else {
      box.textContent = initials(SITE.name);
      box.removeAttribute("aria-hidden");
    }

    // 外部链接
    const meta = $("#meta");
    const links = Array.isArray(SITE.links) ? SITE.links : [];
    meta.innerHTML = links
      .map(
        (l) =>
          '<a class="pill" href="' + esc(l.url) + '"' +
          (/^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : "") + ">" +
          esc(l.label) +
          '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>' +
          "</a>"
      )
      .join("");

    // 顶部导航
    $("#topnav").innerHTML =
      '<a href="#work-title">作业</a>' + links.slice(0, 2).map((l) =>
        '<a href="' + esc(l.url) + '"' + (/^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l.label) + "</a>"
      ).join("");
  }

  /* ---------- 数据处理 ---------- */

  // 统一补齐字段 + 按日期倒序
  const items = (Array.isArray(ASSIGNMENTS) ? ASSIGNMENTS : [])
    .map((a) => ({
      ...a,
      tags: Array.isArray(a.tags) ? a.tags : [],
      files: Array.isArray(a.files) ? a.files : [],
      _date: parseDate(a.date),
      _course: (COURSES && COURSES[a.course]) || { name: a.course || "未分类", color: "#8B8F96" },
    }))
    .sort((x, y) => y._date - x._date);

  const usedCourses = [];
  items.forEach((it) => {
    if (!usedCourses.some((c) => c.key === it.course)) {
      usedCourses.push({ key: it.course, ...it._course });
    }
  });

  let activeCourse = "all";
  let keyword = "";

  /* ---------- 筛选条 ---------- */

  function renderChips() {
    const chips = [{ key: "all", name: "全部", color: "transparent" }].concat(usedCourses);
    $("#chips").innerHTML = chips
      .map(
        (c) =>
          '<button class="chip" type="button" data-course="' + esc(c.key) + '" aria-pressed="' +
          (activeCourse === c.key) + '">' +
          (c.key === "all" ? "" : '<span class="chip__dot" style="--c:' + esc(c.color) + '"></span>') +
          esc(c.name) +
          "</button>"
      )
      .join("");
  }

  /* ---------- 时间线 ---------- */

  const fileIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 1.5H4.5A1.5 1.5 0 0 0 3 3v10A1.5 1.5 0 0 0 4.5 14.5h7A1.5 1.5 0 0 0 13 13V5.5z"/><path d="M9 1.5V5.5H13"/></svg>';
  const codeIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4"/></svg>';

  function cardHTML(a) {
    const actions = [];
    a.files.forEach((f, i) => {
      const external = /^https?:/.test(f.url || "");
      actions.push(
        '<a class="btn' + (i === 0 ? " btn--solid" : "") + '" href="' + esc(f.url) + '"' +
        (external ? ' target="_blank" rel="noopener"' : ' download') + ">" +
        fileIcon + esc(f.label || "附件") + "</a>"
      );
    });
    if (a.repo) {
      actions.push(
        '<a class="btn" href="' + esc(a.repo) + '" target="_blank" rel="noopener">' + codeIcon + "源码</a>"
      );
    }
    if (!actions.length) actions.push('<span class="no-file">暂无附件</span>');

    return (
      '<article class="card">' +
        '<div class="card__top">' +
          '<span class="course" style="--c:' + esc(a._course.color) + '"><i></i>' + esc(a._course.name) + "</span>" +
          (a.grade ? '<span class="grade">' + esc(a.grade) + "</span>" : "") +
        "</div>" +
        '<h3 class="card__title">' + esc(a.title) + "</h3>" +
        (a.summary ? '<p class="card__sum">' + esc(a.summary) + "</p>" : "") +
        '<div class="card__foot">' +
          '<ul class="tags">' + a.tags.map((t) => "<li>" + esc(t) + "</li>").join("") + "</ul>" +
          '<div class="actions">' + actions.join("") + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderTimeline() {
    const kw = keyword.trim().toLowerCase();

    const list = items.filter((a) => {
      if (activeCourse !== "all" && a.course !== activeCourse) return false;
      if (!kw) return true;
      const hay = [a.title, a.summary, a._course.name, a.tags.join(" ")].join(" ").toLowerCase();
      return hay.indexOf(kw) !== -1;
    });

    $("#timeline").innerHTML = list
      .map(
        (a, i) =>
          '<div class="entry" style="--i:' + Math.min(i, 8) + '">' +
            '<time class="entry__date" datetime="' + esc(a.date) + '">' + fmtDate(a._date) + "</time>" +
            '<div class="entry__rail"><span class="dot" style="--c:' + esc(a._course.color) + '"></span></div>' +
            '<div class="entry__body">' + cardHTML(a) + "</div>" +
          "</div>"
      )
      .join("");

    $("#empty").hidden = list.length > 0;

    // 统计文案
    const total = items.length;
    const courseCount = usedCourses.length;
    $("#count").textContent =
      list.length === total
        ? "共 " + total + " 份 · " + courseCount + " 门课程"
        : "筛选出 " + list.length + " / " + total + " 份";

    // 页脚
    $("#footer-note").textContent = "© " + new Date().getFullYear() + " " + SITE.name;
    const latest = items.length ? fmtDate(items[0]._date) : "—";
    $("#footer-updated").textContent = "最近更新 " + latest;
  }

  /* ---------- 事件 ---------- */

  function bindEvents() {
    $("#chips").addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      activeCourse = btn.dataset.course;
      renderChips();
      renderTimeline();
    });

    let timer = null;
    $("#search").addEventListener("input", (e) => {
      const v = e.target.value;
      clearTimeout(timer);
      timer = setTimeout(() => {
        keyword = v;
        renderTimeline();
      }, 120);
    });
  }

  /* ---------- 启动 ---------- */

  renderHeader();
  renderChips();
  renderTimeline();
  bindEvents();
})();
