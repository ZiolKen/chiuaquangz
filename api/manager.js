"use strict";

const OWNER  = "chiuaquang";
const REPO   = "apps";
const PATH   = "apps.js";
const BRANCH = "main";

const $ = (id) => document.getElementById(id);

let TOKEN = "";
let FILE_SHA = "";

const ask = (msg) => confirm(msg);

function setFieldVisible(fieldId, show) {
  const el = document.getElementById(fieldId);
  if (!el) return;

  const label = el.previousElementSibling;
  if (label && label.tagName === "LABEL") {
    label.style.display = show ? "" : "none";
  }

  el.style.display = show ? "" : "none";
  el.disabled = !show;
}

function updateTypeUI() {
  const typeEl = document.getElementById("type");
  if (!typeEl) return;

  const type = typeEl.value.trim().toLowerCase();
  const isLink = type === "link";

  setFieldVisible("os", !isLink);
  setFieldVisible("version", !isLink);
  setFieldVisible("size", !isLink);
  setFieldVisible("detailDesc", !isLink);
  setFieldVisible("screenshots", !isLink);

  if (isLink) {
    const v = document.getElementById("version");
    const sz = document.getElementById("size");
    const d = document.getElementById("detailDesc");
    const sc = document.getElementById("screenshots");
    if (d) d.value = "";
    if (sz) sz.value = "";
    if (v) v.value = "";
    if (sc) sc.value = "";
  }
}

document.getElementById("type")?.addEventListener("change", updateTypeUI);

updateTypeUI();

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

function base64ToUtf8(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

async function ghFetch(url, options = {}) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...options.headers,
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(url, { ...options, headers });

  let json = null;
  try { json = await res.json(); } catch {}
  return { res, json };
}

async function loadLatestFile() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
  const { res, json } = await ghFetch(url);

  if (!res.ok) throw new Error(json?.message || `Không tải được file (HTTP ${res.status})`);

  FILE_SHA = json.sha;
  const contentB64 = (json.content || "").replace(/\n/g, "");
  return base64ToUtf8(contentB64);
}

async function saveFile(newText, message) {
  if(!ask("Xác nhận ghi app.js?")) return;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
  const { res, json } = await ghFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: utf8ToBase64(newText),
      sha: FILE_SHA,
      branch: BRANCH,
    }),
  });
  clearPanelFields({ resetSelect: true });
  if (!res.ok) throw new Error(json?.message || `PUT lỗi (HTTP ${res.status})`);
}

function findAppsArrayRange(source) {
  const m = /const\s+apps\s*=\s*\[/m.exec(source);
  if (!m) throw new Error('Không tìm thấy "const apps = [" trong app.js');

  const start = source.indexOf("[", m.index);
  let i = start;
  let depth = 0;
  let inStr = false;
  let quote = "";
  let esc = false;

  for (; i < source.length; i++) {
    const ch = source[i];

    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === quote) { inStr = false; quote = ""; continue; }
      continue;
    } else {
      if (ch === '"' || ch === "'") { inStr = true; quote = ch; continue; }
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) return { start, end: i };
      }
    }
  }

  throw new Error("Không tìm được dấu ] kết thúc mảng apps");
}

function parseAppsFromSource(source) {
  const { start, end } = findAppsArrayRange(source);
  const prefix = source.slice(0, start);
  const suffix = source.slice(end + 1);

  const arrayText = source.slice(start, end + 1);

  const jsonText = arrayText.replace(/,\s*([}\]])/g, "$1");

  let apps;
  try {
    apps = JSON.parse(jsonText);
  } catch (e) {
    throw new Error("Không parse được mảng apps (có thể file bị sai cú pháp JSON-like).");
  }

  if (!Array.isArray(apps)) throw new Error("apps không phải array");
  return { apps, prefix, suffix };
}

function buildSource(prefix, apps, suffix) {
  const arrayPretty = JSON.stringify(apps, null, 2);
  return `${prefix}${arrayPretty}${suffix}`;
}

function makeKey(a) {
  const name = (a?.name || "").trim().toLowerCase();
  const os = (a?.os || "").trim().toLowerCase();
  const type = (a?.type || "").trim().toLowerCase();
  return `${name}::${os}::${type}`;
}

function normalizeApp(raw) {
  const order = ["type","logo","name","os","version","size","description","downloadLink"];
  const out = {};
  for (const k of order) {
    let v = raw?.[k];
    if (v == null) continue;
    v = String(v).trim();
    if (v === "") continue;
    out[k] = v;
  }
  
  if ((out.type || "").toLowerCase() === "link") {
    delete out.os;
    delete out.version;
    delete out.size;
  }
  
  if ((out.type || "").toLowerCase() !== "link") {
    if (raw.detailDesc) out.detailDesc = raw.detailDesc;
    if (Array.isArray(raw.screenshots) && raw.screenshots.length) {
      out.screenshots = raw.screenshots;
    }
  } else {
    delete out.detailDesc;
    delete out.screenshots;
  }

  return out;
}

function upsertApp(apps, newApp) {
  const key = makeKey(newApp);
  const idx = apps.findIndex(a => makeKey(a) === key);

  if (idx >= 0) {
    apps[idx] = { ...apps[idx], ...newApp };
    return { mode: "updated", index: idx };
  } else {
    apps.push(newApp);
    return { mode: "inserted", index: apps.length - 1 };
  }
}

function looksMojibake(s) {
  return /Ã|Â|�/.test(s);
}
function isLatin1ish(s) {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 255) return false;
  }
  return true;
}
function decodeUtf8FromLatin1(s) {
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}
function fixMojibakeString(s) {
  let out = s;
  for (let i = 0; i < 3; i++) {
    if (!looksMojibake(out)) break;
    if (!isLatin1ish(out)) break;
    const decoded = decodeUtf8FromLatin1(out);
    if (decoded === out) break;
    out = decoded;
  }
  return out;
}
function repairAppsStrings(apps) {
  return apps.map(app => {
    const o = { ...app };
    for (const k of Object.keys(o)) {
      if (typeof o[k] === "string") {
        o[k] = fixMojibakeString(o[k]);
      }
    }
    return o;
  });
}

async function login() {
  const t = $("token")?.value?.trim();
  if (!t) return alert("Nhập token");

  TOKEN = t;

  try {
    await loadLatestFile();
    $("panel").style.display = "block";
    $("card").style.display = "block";
    $("login").remove();
    await refreshDeleteList();
    alert("✅ Login thành công");
  } catch (err) {
    alert("❌ Login lỗi:\n\n" + err.message);
  }
}

function clearPanelFields({ resetSelect = false, focusId = "appName" } = {}) {
  const panelEl = document.getElementById("panel");
  if (!panelEl) return;

  panelEl.querySelectorAll("input, textarea").forEach((el) => {
    el.value = "";
  });

  if (resetSelect) {
    panelEl.querySelectorAll("select").forEach((sel) => {
      sel.selectedIndex = 0;
    });
  }

  const focusEl =
    document.getElementById(focusId) || document.getElementById("appName");
  focusEl?.focus();
}

async function submitApp() {
  const raw = {
    type: $("type").value,
    logo: $("logo").value,
    name: ($("appName") ? $("appName").value : $("name").value),
    os: $("os").value,
    version: $("version").value,
    size: $("size").value,
    description: $("description").value,
    detailDesc: $("detailDesc")?.value || "",
    screenshots: $("screenshots")?.value
    ?.split("\n")
    .map(s => s.trim())
    .filter(Boolean),
    downloadLink: $("downloadLink").value
  };

  const app = normalizeApp(raw);

  if (!app.name) return alert("❌ Bạn chưa nhập Tên App");
  if (!app.downloadLink) return alert("❌ Bạn chưa nhập Link Tải");

  let source;
  try {
    source = await loadLatestFile();
  } catch (err) {
    return alert("❌ Không lấy được file mới nhất\n\n" + err.message);
  }

  let parsed;
  try {
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ app.js không đúng format\n\n" + err.message);
  }

  const result = upsertApp(parsed.apps, app);

  const newSource = buildSource(parsed.prefix, parsed.apps, parsed.suffix);

  try {
    await saveFile(newSource, `${result.mode === "updated" ? "Update" : "Add"} app: ${app.name}`);
    updateTypeUI();
    await refreshDeleteList();
    alert(`🎉 Thành công: ${result.mode === "updated" ? "Đã UPDATE" : "Đã THÊM"} "${app.name}"`);
  } catch (err) {
    alert("❌ Lỗi khi ghi app.js\n\n" + err.message);
  }
}

async function repairUtfAndCleanup() {
  let source;
  try {
    source = await loadLatestFile();
  } catch (err) {
    return alert("❌ Không lấy được file mới nhất\n\n" + err.message);
  }

  let parsed;
  try {
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ app.js không đúng format\n\n" + err.message);
  }

  let apps = parsed.apps.filter(a => a && typeof a === "object" && String(a.name || "").trim() !== "");

  apps = repairAppsStrings(apps);

  apps = apps.map(normalizeApp);

  const newSource = buildSource(parsed.prefix, apps, parsed.suffix);

  try {
    await saveFile(newSource, "Repair UTF + cleanup invalid apps");
    await refreshDeleteList();
    alert("✅ Đã sửa UTF + xoá app thiếu name.\nGiờ update sẽ không hỏng tiếng Việt nữa.");
  } catch (err) {
    alert("❌ Lỗi khi ghi app.js\n\n" + err.message);
  }
}

function makeDeleteToken(app, index) {
  const tokenObj = {
    index,
    name: String(app?.name || ""),
    os: String(app?.os || ""),
    type: String(app?.type || ""),
    downloadLink: String(app?.downloadLink || "")
  };
  return utf8ToBase64(JSON.stringify(tokenObj));
}

function readDeleteToken(token) {
  return JSON.parse(base64ToUtf8(token));
}

function formatOptionText(app, idx) {
  const type = (app?.type || "?").trim();
  const os = (app?.os || "").trim();
  const nameRaw = String(app?.name || "").trim();
  const name = nameRaw ? fixMojibakeString(nameRaw) : "(NO NAME)";

  const ver = (app?.version || "").trim();
  const size = (app?.size || "").trim();

  let extra = "";
  if (type.toLowerCase() !== "link") {
    const parts = [];
    if (ver) parts.push("v" + ver);
    if (size) parts.push(size);
    if (parts.length) extra = " — " + parts.join(" • ");
  }

  const head = os ? `[${type} | ${os}]` : `[${type}]`;
  return `#${idx + 1} ${head} ${name}${extra}`;
}

function sameForDelete(app, info) {
  const norm = (x) => String(x || "").trim().toLowerCase();
  return (
    norm(app?.name) === norm(info.name) &&
    norm(app?.type) === norm(info.type) &&
    norm(app?.os) === norm(info.os) &&
    norm(app?.downloadLink) === norm(info.downloadLink)
  );
}

async function refreshDeleteList() {
  const sel = document.getElementById("deleteSelect");
  if (!sel) return;

  sel.innerHTML = `<option value="">(Đang tải danh sách...)</option>`;

  let source;
  try {
    source = await loadLatestFile();
  } catch (err) {
    sel.innerHTML = `<option value="">(Lỗi tải danh sách)</option>`;
    return alert("❌ Không lấy được app.js\n\n" + err.message);
  }

  let parsed;
  try {
    parsed = parseAppsFromSource(source);
  } catch (err) {
    sel.innerHTML = `<option value="">(Parse lỗi)</option>`;
    return alert("❌ app.js không đúng format\n\n" + err.message);
  }

  sel.innerHTML = `<option value="">-- Chọn app/link để xoá --</option>`;

  parsed.apps.forEach((app, idx) => {
    const opt = document.createElement("option");
    opt.value = makeDeleteToken(app, idx);
    opt.textContent = formatOptionText(app, idx);
    sel.appendChild(opt);
  });
}

async function deleteSelected() {
  const sel = document.getElementById("deleteSelect");
  if (!sel || !sel.value) return alert("❌ Hãy chọn 1 app/link để xoá");

  let info;
  try {
    info = readDeleteToken(sel.value);
  } catch {
    return alert("❌ Dữ liệu chọn bị lỗi. Bấm 'Làm mới danh sách' rồi thử lại.");
  }

  const prettyName = fixMojibakeString(info.name || "(NO NAME)");
  const prettyType = info.type || "?";
  const prettyOs = info.os ? ` | ${info.os}` : "";

  if (!confirm(`Bạn chắc chắn muốn XOÁ?\n\n${prettyType}${prettyOs}: ${prettyName}`)) return;

  let source;
  try {
    source = await loadLatestFile();
  } catch (err) {
    return alert("❌ Không lấy được file mới nhất\n\n" + err.message);
  }

  let parsed;
  try {
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ app.js parse lỗi\n\n" + err.message);
  }

  let delIndex = -1;

  if (info.index >= 0 && info.index < parsed.apps.length && sameForDelete(parsed.apps[info.index], info)) {
    delIndex = info.index;
  } else {
    delIndex = parsed.apps.findIndex(a => sameForDelete(a, info));
  }

  if (delIndex === -1) {
    const norm = (x) => String(x || "").trim().toLowerCase();
    delIndex = parsed.apps.findIndex(a =>
      norm(a?.name) === norm(info.name) &&
      norm(a?.type) === norm(info.type) &&
      norm(a?.os) === norm(info.os)
    );
  }

  if (delIndex === -1) {
    await refreshDeleteList();
    return alert("❌ Không tìm thấy item để xoá (file có thể đã thay đổi). Đã làm mới danh sách.");
  }

  const removed = parsed.apps.splice(delIndex, 1)[0];
  const removedName = fixMojibakeString(String(removed?.name || "(NO NAME)"));
  const newSource = buildSource(parsed.prefix, parsed.apps, parsed.suffix);

  try {
    await saveFile(newSource, `Delete: ${removedName}`);
    alert(`🗑️ Đã xoá: ${removedName}`);
    await refreshDeleteList();
  } catch (err) {
    alert("❌ Lỗi khi ghi app.js\n\n" + err.message);
  }
}

let EDIT_TOKEN = "";
let RAW_TOKEN = "";

function getNameEl() {
  return document.getElementById("appName") || document.getElementById("name");
}

function getSelectedManageToken() {
  const sel = document.getElementById("deleteSelect");
  return sel?.value || "";
}

function findIndexByInfo(apps, info) {
  let idx = -1;

  if (
    typeof info?.index === "number" &&
    info.index >= 0 &&
    info.index < apps.length &&
    sameForDelete(apps[info.index], info)
  ) {
    idx = info.index;
  } else {
    idx = apps.findIndex((a) => sameForDelete(a, info));
  }

  if (idx === -1) {
    const norm = (x) => String(x || "").trim().toLowerCase();
    idx = apps.findIndex(
      (a) =>
        norm(a?.name) === norm(info.name) &&
        norm(a?.type) === norm(info.type) &&
        norm(a?.os) === norm(info.os)
    );
  }

  return idx;
}

function setSelectValue(id, value) {
  const sel = document.getElementById(id);
  if (!sel) return;
  const v = String(value ?? "");

  if (Array.from(sel.options).some((o) => o.value === v)) {
    sel.value = v;
    return;
  }
  const opt = Array.from(sel.options).find(
    (o) => String(o.value).toLowerCase() === v.toLowerCase()
  );
  if (opt) sel.value = opt.value;
}

function fillFormFromApp(app) {
  setSelectValue("type", fixMojibakeString(app?.type || "iPA"));
  const nameEl = getNameEl();
  if (nameEl) nameEl.value = fixMojibakeString(app?.name || "");

  const logoEl = document.getElementById("logo");
  if (logoEl) logoEl.value = fixMojibakeString(app?.logo || "");

  const verEl = document.getElementById("version");
  if (verEl) verEl.value = fixMojibakeString(app?.version || "");

  const sizeEl = document.getElementById("size");
  if (sizeEl) sizeEl.value = fixMojibakeString(app?.size || "");

  const descEl = document.getElementById("description");
  if (descEl) descEl.value = fixMojibakeString(app?.description || "");
  
  const dd = document.getElementById("detailDesc");
if (dd) dd.value = fixMojibakeString(app?.detailDesc || "");

 const sc = document.getElementById("screenshots");
if (sc) sc.value = (app?.screenshots || []).join("\n");

  const dlEl = document.getElementById("downloadLink");
  if (dlEl) dlEl.value = fixMojibakeString(app?.downloadLink || "");

  if (app?.os) setSelectValue("os", fixMojibakeString(app.os));

  if (typeof updateTypeUI === "function") updateTypeUI();
}

function cloneFixStringsDeep(value) {
  if (Array.isArray(value)) return value.map(cloneFixStringsDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = cloneFixStringsDeep(v);
    return out;
  }
  if (typeof value === "string") return fixMojibakeString(value);
  return value;
}

async function loadSelectedIntoForm() {
  const token = getSelectedManageToken();
  if (!token) return alert("❌ Hãy chọn 1 app/link trong danh sách");

  EDIT_TOKEN = token;

  let info;
  try { info = readDeleteToken(token); }
  catch { return alert("❌ Token item lỗi. Bấm 'Làm mới danh sách' rồi thử lại."); }

  let source, parsed;
  try {
    source = await loadLatestFile();
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ Không đọc được app.js\n\n" + err.message);
  }

  const idx = findIndexByInfo(parsed.apps, info);
  if (idx === -1) {
    await refreshDeleteList();
    EDIT_TOKEN = "";
    return alert("❌ Không tìm thấy item (file đã thay đổi). Đã làm mới danh sách.");
  }

  fillFormFromApp(parsed.apps[idx]);
  alert("✅ Đã load item vào form. Sửa xong bấm: 'Lưu sửa (từ form)'.");
}

async function updateSelectedFromForm() {
  const detailDescVal = String(document.getElementById("detailDesc")?.value || "").trim();
  const screenshotsVal = document.getElementById("screenshots")?.value
    ?.split("\n")
    .map(s => s.trim())
    .filter(Boolean);
  const token = EDIT_TOKEN || getSelectedManageToken();
  if (!token) return alert("❌ Hãy chọn 1 item và bấm 'Load vào form để sửa' trước");

  let info;
  try { info = readDeleteToken(token); }
  catch { return alert("❌ Token item lỗi. Bấm 'Làm mới danh sách' rồi thử lại."); }

  const typeVal = String(document.getElementById("type")?.value || "").trim();
  const nameVal = String(getNameEl()?.value || "").trim();
  const logoVal = String(document.getElementById("logo")?.value || "").trim();
  const osVal = String(document.getElementById("os")?.value || "").trim();
  const verVal = String(document.getElementById("version")?.value || "").trim();
  const sizeVal = String(document.getElementById("size")?.value || "").trim();
  const descVal = String(document.getElementById("description")?.value || "").trim();
  const dlVal = String(document.getElementById("downloadLink")?.value || "").trim();

  if (!nameVal) return alert("❌ Tên App không được để trống");
  if (!dlVal) return alert("❌ Link Tải không được để trống");

  let source, parsed;
  try {
    source = await loadLatestFile();
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ Không đọc được app.js\n\n" + err.message);
  }

  const idx = findIndexByInfo(parsed.apps, info);
  if (idx === -1) {
    await refreshDeleteList();
    EDIT_TOKEN = "";
    return alert("❌ Không tìm thấy item để update (file đã thay đổi). Đã làm mới danh sách.");
  }

  const updated = { ...parsed.apps[idx] };

  updated.type = typeVal || updated.type || "iPA";
  updated.name = nameVal;
  updated.downloadLink = dlVal;

  if (logoVal) updated.logo = logoVal; else delete updated.logo;
  if (descVal) updated.description = descVal; else delete updated.description;

  if (String(updated.type || "").toLowerCase() === "link") {
    delete updated.os;
    delete updated.version;
    delete updated.size;
  } else {
    updated.os = osVal || updated.os || "iOS";
    if (verVal) updated.version = verVal; else delete updated.version;
    if (sizeVal) updated.size = sizeVal; else delete updated.size;
  }
  
  if (String(updated.type || "").toLowerCase() !== "link") {
    if (detailDescVal) updated.detailDesc = detailDescVal;
    else delete updated.detailDesc;
  
    if (screenshotsVal && screenshotsVal.length)
      updated.screenshots = screenshotsVal;
    else delete updated.screenshots;
  } else {
    delete updated.detailDesc;
    delete updated.screenshots;
  }

  parsed.apps[idx] = updated;

  const newSource = buildSource(parsed.prefix, parsed.apps, parsed.suffix);

  try {
    await saveFile(newSource, `Edit: ${updated.name}`);
    EDIT_TOKEN = "";
    alert(`✅ Đã cập nhật: ${updated.name}`);
    await refreshDeleteList();
  } catch (err) {
    alert("❌ Lỗi khi ghi app.js\n\n" + err.message);
  }
}

function openRawBox(show) {
  const box = document.getElementById("rawBox");
  if (!box) return;
  box.style.display = show ? "" : "none";
}

async function openRawEditor() {
  const token = getSelectedManageToken();
  if (!token) return alert("❌ Hãy chọn 1 app/link trong danh sách");

  RAW_TOKEN = token;

  let info;
  try { info = readDeleteToken(token); }
  catch { return alert("❌ Token item lỗi. Bấm 'Làm mới danh sách' rồi thử lại."); }

  let source, parsed;
  try {
    source = await loadLatestFile();
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ Không đọc được app.js\n\n" + err.message);
  }

  const idx = findIndexByInfo(parsed.apps, info);
  if (idx === -1) {
    await refreshDeleteList();
    RAW_TOKEN = "";
    return alert("❌ Không tìm thấy item (file đã thay đổi). Đã làm mới danh sách.");
  }

  const rawEl = document.getElementById("rawEditor");
  if (!rawEl) return;

  const appForEdit = cloneFixStringsDeep(parsed.apps[idx]);
  rawEl.value = JSON.stringify(appForEdit, null, 2);

  openRawBox(true);
  rawEl.focus();
}

function closeRawEditor() {
  RAW_TOKEN = "";
  const rawEl = document.getElementById("rawEditor");
  if (rawEl) rawEl.value = "";
  openRawBox(false);
}

async function saveRawEditor() {
  const token = RAW_TOKEN || getSelectedManageToken();
  if (!token) return alert("❌ Hãy chọn 1 item trước");

  let info;
  try { info = readDeleteToken(token); }
  catch { return alert("❌ Token item lỗi. Bấm 'Làm mới danh sách' rồi thử lại."); }

  const rawEl = document.getElementById("rawEditor");
  if (!rawEl) return;

  let obj;
  try {
    obj = JSON.parse(rawEl.value);
  } catch (e) {
    return alert("❌ JSON lỗi (raw phải là JSON hợp lệ, không trailing comma).\n\n" + e.message);
  }

  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return alert('❌ Raw phải là 1 object dạng { ... }');
  }

  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === "string") obj[k] = obj[k].trim();
  }

  if (!String(obj.name || "").trim()) return alert('❌ Raw bắt buộc có field "name"');
  if (!String(obj.downloadLink || "").trim()) return alert('❌ Raw bắt buộc có field "downloadLink"');

  if (String(obj.type || "").trim().toLowerCase() === "link") {
    delete obj.os;
    delete obj.version;
    delete obj.size;
  }

  let source, parsed;
  try {
    source = await loadLatestFile();
    parsed = parseAppsFromSource(source);
  } catch (err) {
    return alert("❌ Không đọc được app.js\n\n" + err.message);
  }

  const idx = findIndexByInfo(parsed.apps, info);
  if (idx === -1) {
    await refreshDeleteList();
    RAW_TOKEN = "";
    return alert("❌ Không tìm thấy item để lưu raw (file đã thay đổi). Đã làm mới danh sách.");
  }

  parsed.apps[idx] = obj;

  const newSource = buildSource(parsed.prefix, parsed.apps, parsed.suffix);

  try {
    await saveFile(newSource, `Raw edit: ${obj.name}`);
    alert(`✅ Đã lưu raw: ${obj.name}`);
    closeRawEditor();
    await refreshDeleteList();
  } catch (err) {
    alert("❌ Lỗi khi ghi app.js\n\n" + err.message);
  }
}

window.loadSelectedIntoForm = loadSelectedIntoForm;
window.updateSelectedFromForm = updateSelectedFromForm;
window.openRawEditor = openRawEditor;
window.saveRawEditor = saveRawEditor;
window.closeRawEditor = closeRawEditor;
window.refreshDeleteList = refreshDeleteList;
window.deleteSelected = deleteSelected;
window.login = login;
window.submitApp = submitApp;
window.repairUtfAndCleanup = repairUtfAndCleanup;