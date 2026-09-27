/* ============================================================
   IVUS/NIRS Case Library — rendering logic
   No build step: plain fetch() against /data/*.json.
   Note: opening index.html directly via file:// will block
   fetch() in most browsers — run a local server when testing
   (see README), it works normally once deployed.
   ============================================================ */

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Không tải được " + path);
  return res.json();
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

/* ---------- homepage: topic grid ---------- */

async function renderTopicGrid(targetId) {
  const target = document.getElementById(targetId);
  const [topics, cases] = await Promise.all([
    loadJSON("data/topics.json"),
    loadJSON("data/cases.json"),
  ]);

  target.innerHTML = "";
  topics.forEach((t, i) => {
    const count = cases.filter((c) => c.topic === t.slug).length;
    const card = el(
      "a",
      "topic-card",
      `
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <h3>${t.title}</h3>
      <p>${t.description}</p>
      <span class="go">${count} case${count === 1 ? "" : ""} →</span>
    `
    );
    card.href = `topic.html?topic=${t.slug}`;
    target.appendChild(card);
  });
}

/* ---------- topic page: case grid ---------- */

async function renderTopicPage() {
  const slug = qs("topic");
  const [topics, cases] = await Promise.all([
    loadJSON("data/topics.json"),
    loadJSON("data/cases.json"),
  ]);
  const topic = topics.find((t) => t.slug === slug);
  const list = cases.filter((c) => c.topic === slug);

  document.getElementById("topic-title").textContent = topic
    ? topic.title
    : "Chủ đề";
  document.getElementById("topic-desc").textContent = topic
    ? topic.description
    : "";
  document.getElementById("topic-count").textContent = `${list.length} case`;
  document.title = (topic ? topic.title : "Chủ đề") + " — IVUS Case Library";

  const grid = document.getElementById("case-grid");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.appendChild(
      el("div", "empty", "Chưa có case nào trong chủ đề này.")
    );
    return;
  }

  list.forEach((c) => {
    const card = el(
      "a",
      "case-card",
      `
      <div class="thumb" style="background-image:url('${c.cover_image}')"></div>
      <div class="body">
        <span class="case-tag">${c.modality || "IVUS"}</span>
        <h3>${c.title}</h3>
        <div class="meta">${c.vessel || ""}</div>
      </div>
    `
    );
    card.href = `case.html?id=${c.id}`;
    grid.appendChild(card);
  });
}

/* ---------- case detail page ---------- */

async function renderCasePage() {
  const id = qs("id");
  const [topics, cases] = await Promise.all([
    loadJSON("data/topics.json"),
    loadJSON("data/cases.json"),
  ]);
  const c = cases.find((x) => x.id === id);

  if (!c) {
    document.getElementById("case-root").innerHTML =
      '<div class="wrap"><div class="empty">Không tìm thấy case này.</div></div>';
    return;
  }

  const topic = topics.find((t) => t.slug === c.topic);
  document.title = c.title + " — IVUS Case Library";

  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">Thư viện case</a> /
    <a href="topic.html?topic=${c.topic}">${topic ? topic.title : c.topic}</a>
  `;
  document.getElementById("case-title").textContent = c.title;
  document.getElementById("case-summary").textContent = c.summary || "";

  document.getElementById("case-meta").innerHTML = `
    <div><span>Bệnh nhân</span>${c.age_sex || "—"}</div>
    <div><span>Mạch máu</span>${c.vessel || "—"}</div>
    <div><span>Phương tiện</span>${c.modality || "IVUS"}</div>
  `;

  const gallery = document.getElementById("image-gallery");
  gallery.innerHTML = "";
  (c.images || []).forEach((src) => {
    const img = el("img");
    img.src = src;
    img.alt = c.title;
    img.loading = "lazy";
    gallery.appendChild(img);
  });

  const videoWrap = document.getElementById("video-wrap");
  if (c.youtube_id) {
    videoWrap.innerHTML = `
      <div class="video-embed">
        <iframe src="https://www.youtube.com/embed/${c.youtube_id}"
          title="${c.title}" allowfullscreen></iframe>
      </div>
    `;
  } else {
    videoWrap.innerHTML = "";
  }

  const findings = document.getElementById("findings");
  findings.innerHTML = "";
  (c.findings || []).forEach((f) => {
    findings.appendChild(
      el("li", null, `<strong>${f.label}</strong>${f.text}`)
    );
  });

  document.getElementById("case-notes-text").textContent = c.notes || "";
}
