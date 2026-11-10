const heroSlides = [
  "assets/images/post_224022403951_6.jpg",
  "assets/images/post_224447931876_4.png",
  "assets/images/post_224022403951_5.jpg"
];

const stories = [
  {
    img: "assets/images/post_224447966248_2.png",
    title: "제주공항에서 10분, 도착한 첫날부터 편안한 도심 생활권",
    desc: "렌터카 없이도 제주공항에서 택시로 10분이면 도착합니다.<br class='d-br' /> 건물 1층에 약국·편의점·식당이 자리해 차 없이도 하루가 편안합니다."
  },
  {
    img: "assets/images/post_224022403951_2.jpg",
    title: "한 달에 한 번만 계산하는 합리적인 정찰 요금",
    desc: "1인실 월 45만 원, 2인실·다인실 월 40만 원(관리비 월 3~4만 원).<br class='d-br' /> 숙소비 부담을 덜고 한 달 내내 마음 편히 쉬어갈 수 있습니다."
  },
  {
    img: "assets/images/post_224447931876_5.png",
    title: "파티 없는 집, 밤 10시 이후의 고요함",
    desc: "공용 라운지는 밤 10시까지만 운영하며 음주 파티를 열지 않습니다.<br class='d-br' /> 원할 때는 주방에서 저녁을 함께하고, 혼자 있고 싶은 날엔 조용히 쉬세요."
  }
];

let isEditMode = false;
let currentStoryIdx = 0;
const STORAGE_KEY = "voluntour_jeju_live_edits_v4";

const EDITABLE_SELECTORS = [
  ".brand-name",
  ".nav-links a",
  ".hero-eyebrow",
  ".hero-title",
  ".hero-desc",
  ".stat-value strong",
  ".stat-label",
  ".hero-thumb span",
  ".section-label",
  ".section-title",
  ".section-lead",
  ".story-name",
  "#storyTitle",
  "#storyDesc",
  ".clean-badge",
  ".clean-card-title",
  ".clean-card-price",
  ".clean-card-sub",
  ".guide-left p",
  ".foundation-badge strong",
  ".foundation-badge span",
  ".guide-card h3",
  ".guide-card p",
  ".infra-time",
  ".infra-card h4",
  ".infra-desc-inner",
  ".dark-food-header p",
  ".food-pill-tag",
  ".food-card-bottom h4",
  ".food-card-bottom p",
  ".review-quote",
  ".review-meta",
  ".faq-split-layout > div > p",
  ".faq-q span:first-child",
  ".faq-a",
  ".route-pill",
  ".contact-pill-card strong",
  ".contact-pill-card span",
  ".footer-minimal span"
].join(", ");

// Cross-fade Hero Image
function setHero(idx) {
  const img = document.getElementById("heroMainImg");
  if (!img) return;
  img.classList.add("switching");
  document.querySelectorAll(".hero-thumb").forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });
  setTimeout(() => {
    img.src = heroSlides[idx];
    img.classList.remove("switching");
  }, 200);
}

// Cross-fade Story Image & Text
function setStory(idx) {
  currentStoryIdx = idx;
  const s = stories[idx];
  document.querySelectorAll(".story-item").forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });

  const img = document.getElementById("storyImg");
  const cap = document.getElementById("storyCaptionBox");
  if (img) img.classList.add("switching");
  if (cap) cap.classList.add("switching");

  setTimeout(() => {
    if (img) {
      img.src = s.img;
      img.classList.remove("switching");
    }
    document.getElementById("storyTitle").innerHTML = s.title;
    document.getElementById("storyDesc").innerHTML = s.desc;
    if (cap) cap.classList.remove("switching");
  }, 200);
}

// Walk-Life Focus Card & Timeline Gauge
let currentInfraIdx = 0;
let infraTimer = null;

function setInfraFocus(idx) {
  currentInfraIdx = idx;
  const cards = document.querySelectorAll(".infra-card");
  cards.forEach((c, i) => {
    c.classList.toggle("active", i === idx);
  });
  const fill = document.getElementById("walkTimelineFill");
  if (fill) {
    fill.style.width = `${(idx + 1) * 25}%`;
  }
}

function startInfraCycle() {
  stopInfraCycle();
  infraTimer = setInterval(() => {
    if (isEditMode) return;
    const next = (currentInfraIdx + 1) % 4;
    setInfraFocus(next);
  }, 3200);
}

function stopInfraCycle() {
  if (infraTimer) {
    clearInterval(infraTimer);
    infraTimer = null;
  }
}

// Smooth Accordion FAQ (Single-open accordion: first item open by default, others collapsed)
function resetFaqDefaultState() {
  document.querySelectorAll(".faq-item").forEach((item, idx) => {
    item.classList.toggle("open", idx === 0);
  });
}

function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  if (!item) return;

  // In edit mode, clicking the text inside the already-open question edits it;
  // clicking a closed question (or the +/- icon) opens that question and closes others.
  const isAlreadyOpen = item.classList.contains("open");
  if (isEditMode && isAlreadyOpen) {
    return;
  }

  document.querySelectorAll(".faq-item").forEach(other => {
    if (other !== item) {
      other.classList.remove("open");
    }
  });
  item.classList.toggle("open", !isAlreadyOpen);
}

// Modal
function openModal(img, title, desc) {
  if (isEditMode) return; // don't pop modal when clicking text in edit mode
  document.getElementById("modalImg").src = img;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;
  document.getElementById("detailModal").classList.add("open");
}

function closeModal(e) {
  if (!e || e.target.id === "detailModal" || e.target.closest(".modal-close-btn")) {
    document.getElementById("detailModal").classList.remove("open");
  }
}

function copyText(text, label) {
  if (isEditMode) return;
  if (navigator.clipboard) navigator.clipboard.writeText(text);
  showToast(`✓ ${label} 복사됨 (${text})`);
}

function showToast(msg) {
  const t = document.getElementById("toastMsg");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

// =========================================================
// LIVE TEXT EDIT MODE LOGIC
// =========================================================
function getEditableNodes() {
  return Array.from(document.querySelectorAll(EDITABLE_SELECTORS));
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  document.body.classList.toggle("edit-mode-on", isEditMode);

  const dock = document.getElementById("editorDock");
  const toggleBtn = document.getElementById("editToggleBtn");
  dock.classList.toggle("editing", isEditMode);
  toggleBtn.classList.toggle("active", isEditMode);
  toggleBtn.innerHTML = isEditMode
    ? "✓ 문구 편집 완료 (끄기)"
    : "✏️ 화면에서 바로 글씨 수정";

  const nodes = getEditableNodes();
  nodes.forEach(node => {
    if (isEditMode) {
      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
    } else {
      node.removeAttribute("contenteditable");
      node.removeAttribute("spellcheck");
    }
  });

  // Keep only the first FAQ open even in edit mode (click any question to open & edit it)
  if (isEditMode) {
    showToast("✏️ 편집 모드가 켜졌습니다. 원하는 글씨를 클릭해 바로 수정하세요!");
  } else {
    resetFaqDefaultState();
    saveToLocalStorage();
    showToast("✓ 수정한 문구가 브라우저에 자동 저장되었습니다.");
  }
}

function saveToLocalStorage() {
  const nodes = getEditableNodes();
  const data = {
    nodes: nodes.map(n => n.innerHTML),
    stories: stories
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const nodes = getEditableNodes();
    if (data.nodes && data.nodes.length === nodes.length) {
      nodes.forEach((n, i) => {
        n.innerHTML = data.nodes[i];
      });
    }
    if (data.stories && data.stories.length === stories.length) {
      data.stories.forEach((s, i) => {
        stories[i].title = s.title;
        stories[i].desc = s.desc;
      });
    }
    return true;
  } catch (e) {
    return false;
  }
}

function resetEdits() {
  if (!confirm("직접 수정한 문구를 모두 초기 상태로 되돌릴까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

async function downloadEditedHtml() {
  saveToLocalStorage();

  // Clone document to produce clean HTML without temporary editing outlines
  const clone = document.documentElement.cloneNode(true);
  clone.querySelector("body").classList.remove("edit-mode-on");
  clone.querySelectorAll("[contenteditable]").forEach(el => {
    el.removeAttribute("contenteditable");
    el.removeAttribute("spellcheck");
  });
  const dockClone = clone.querySelector("#editorDock");
  if (dockClone) dockClone.classList.remove("editing");
  const btnClone = clone.querySelector("#editToggleBtn");
  if (btnClone) {
    btnClone.classList.remove("active");
    btnClone.innerHTML = "✏️ 화면에서 바로 글씨 수정";
  }
  clone.querySelectorAll(".faq-item").forEach((item, idx) => {
    item.classList.toggle("open", idx === 0);
  });

  const htmlString = "<!DOCTYPE html>\n" + clone.outerHTML;

  // Use File System Access API if available so user can directly overwrite index.html
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "index.html",
        types: [{ description: "HTML File", accept: { "text/html": [".html"] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(htmlString);
      await writable.close();
      showToast("💾 수정된 HTML 파일이 저장되었습니다!");
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  // Fallback browser download
  const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "index.html";
  a.click();
  URL.revokeObjectURL(url);
  showToast("💾 수정된 index.html 파일이 다운로드되었습니다!");
}

// Number Counter Animation
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.textContent || el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Restore any saved user edits from localStorage first
  const hadSavedEdits = loadFromLocalStorage();
  resetFaqDefaultState();

  // 1. Scroll Reveal Observer
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // 2. Hero Number Count-up (only if not edited to custom text)
  if (!hadSavedEdits) {
    animateCounters();
  }

  // 3. Auto-cycle Walkable Neighborhood Focus Cards
  startInfraCycle();
  const grid = document.getElementById("walkInfraGrid");
  if (grid) {
    grid.addEventListener("mouseenter", stopInfraCycle);
    grid.addEventListener("mouseleave", startInfraCycle);
  }

  // 4. Prevent link navigation while editing text inside <a> tags
  document.addEventListener("click", e => {
    if (!isEditMode) return;
    const link = e.target.closest("a");
    if (link && !e.target.closest("#editorDock")) {
      e.preventDefault();
    }
  });

  // 5. Auto-save on typing in Edit Mode & sync Story data
  document.addEventListener("input", e => {
    if (!isEditMode) return;
    if (e.target.id === "storyTitle") {
      stories[currentStoryIdx].title = e.target.innerHTML;
    } else if (e.target.id === "storyDesc") {
      stories[currentStoryIdx].desc = e.target.innerHTML;
    }
    saveToLocalStorage();
  });
});
