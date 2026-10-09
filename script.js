const pageStyle = document.createElement("style");
pageStyle.id = "pageSize";
pageStyle.textContent = "@page{size:A4;margin:8mm}";
document.head.appendChild(pageStyle);

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const BN = "০১২৩৪৫৬৭৮৯";
const norm = s => String(s ?? "").replace(/[০-৯]/g, d => BN.indexOf(d));
const num = v => { const n = parseFloat(norm(v).replace(/,/g, "")); return isNaN(n) ? 0 : n; };
const rupee = n => "₹" + (Number(n)||0).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2});
const rupee0 = n => "₹" + Math.round(Number(n)||0).toLocaleString("en-IN");
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
};
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2400);
}

const DEFAULT_SHOP = {
  name:"DRIFT", code:"DRF",
  tagline:"Car Accessories • Premium Quality • Style Your Ride",
  address:"Jodthbhim, Newtown, Baligari, West Bengal - 700160",
  phone:"+91 81588 66716", email:"", gstin:"", upi:"", brand:"#ff4d2e",
  logo:"",
  notes:"Thank you for shopping with Drift!\nGoods once sold are subject to store policy.\nWarranty, if any, is as per the manufacturer's terms.\nPlease keep this bill for future reference.",
  thanks:"Thank you • Drive safe • Visit again"
};
let shop = Object.assign({}, DEFAULT_SHOP, store.get("shop2", {}));

const CAR_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true">
<path d="M4 27h13M1 33h14M6 39h11" stroke="#12b5e5" stroke-width="2.6" stroke-linecap="round" fill="none"/>
<g transform="translate(33 30) skewX(-10) translate(-33 -30)"><path fill-rule="evenodd" fill="#fff" d="M20 13h16c11 0 18 7 18 16s-7 16-18 16H20zM29 21v16h6c5.500 0 9-3 9-8s-3.500-8-9-8z"/></g>
<path d="M16 50c9 3.500 24 3.500 33 0" stroke="#ff4d2e" stroke-width="3.200" stroke-linecap="round" fill="none"/>
<circle cx="50" cy="50" r="1.800" fill="#ffc21a"/>
</svg>`;
const ICON = {
  pin:  `<span class="ic i-pin"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5z"/></svg></span>`,
  wa:   `<span class="ic i-wa"><svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.700 13.600L3 21l4.500-1.200A9 9 0 1 0 12 3z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M9.200 7.800c-.5.500-.8 1.300-.3 2.500.8 1.800 2.200 3.200 4 4 1.200.5 2 .2 2.500-.3l.5-.9-2-1-.8.7c-1-.4-2-1.400-2.400-2.400l.7-.8-1-2z" fill="#fff"/></svg></span>`,
  call: `<span class="ic i-call"><svg viewBox="0 0 24 24" fill="#fff"><path d="M6.600 10.800a15 15 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.25 11.400 11.400 0 0 0 3.600.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.300.2 2.500.6 3.600a1 1 0 0 1-.25 1z"/></svg></span>`,
  mail: `<span class="ic i-mail"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5.500" width="18" height="13" rx="2"/><path d="M3.500 7l8.500 6.500L20.500 7"/></svg></span>`
};
function monogram(){ return (shop.name.trim()[0] || "S").toUpperCase(); }
function setLogo(el, src){
  el.innerHTML = src ? `<img alt="" src="${src}">` : CAR_SVG;
}
function applyShop(){
  const nm = [...shop.name.trim()]; $("shopName").innerHTML = nm.length ? `<span class="d">${esc(nm[0])}</span>${esc(nm.slice(1).join(""))}` : "";
  $("shopTag").textContent = shop.tagline;
  const chips = [];
  if(shop.address) chips.push(`<span class="chip2">${ICON.pin}${esc(shop.address)}</span>`);
  if(shop.phone) chips.push(`<span class="chip2">${ICON.wa}${ICON.call}${esc(shop.phone)}</span>`);
  if(shop.email) chips.push(`<span class="chip2">${ICON.mail}${esc(shop.email)}</span>`);
  if(shop.gstin) chips.push(`<span class="chip2 gstc">GSTIN: ${esc(shop.gstin)}</span>`);
  $("contact").innerHTML = chips.join("");
  setLogo($("logo"), shop.logo);
  $("notesList").innerHTML = shop.notes.split("\n").filter(l => l.trim()).map(l => `<li>${esc(l)}</li>`).join("");
  $("thanks").textContent = shop.thanks;
  $("wmText").textContent = shop.name;
  $("paper").style.setProperty("--wmsize", Math.max(70, Math.min(190, 950 / Math.max(shop.name.length, 1))) + "px");
  document.title = shop.name + " – Billing";
}

let bills = store.get("bills", []);
let counter = store.get("counter", 0);
let pays = [];
let filter = "all";
let editing = false;
let dirty = false;
let advMode = false;
const ROWS = 12;
const rates = {};

const sumPays = a => Math.round(a.reduce((s, p) => s + p.amt, 0) * 100) / 100;
function mkPay(amt, mode, kind){ const d = new Date(); return {amt: Math.round(amt * 100) / 100, mode: mode || $("mode").value, kind: kind || "Payment", ts: d.getTime(), date: fmtDate(d), time: fmtTime(d)}; }
function legacyPays(b){
  const amt = b.paid > 0 ? Math.min(b.paid, b.total) : b.total;
  return amt > 0 ? [{amt, mode: b.mode, ts: b.ts, date: b.date, time: b.time}] : [];
}
const billPaid = b => Array.isArray(b.payments) ? sumPays(b.payments) : sumPays(legacyPays(b));
const billDue = b => Math.max(0, Math.round((b.total - billPaid(b)) * 100) / 100);
function currentPays(total){
  const raw = $("paid").value.trim();
  if(!editing){
    const amt = raw === "" ? total : Math.min(num(raw), total);
    return amt > 0 ? [mkPay(amt, null, amt < total - 0.004 ? "Advance" : "Payment")] : [];
  }
  if(raw === "") return pays;
  const v = Math.min(num(raw), total);
  if(Math.abs(v - sumPays(pays)) < 0.005) return pays;
  return v > 0 ? [mkPay(v, null, v < total - 0.004 ? "Advance" : "Payment")] : [];
}

function nextNo(){ return `${shop.code || "INV"}-${String(counter + 1).padStart(5, "0")}`; }
function buildRates(){
  Object.keys(rates).forEach(k => delete rates[k]);
  const names = new Set();
  [...bills].reverse().forEach(b => (b.items||[]).forEach(i => { if(i.name){ rates[i.name.toLowerCase()] = i.rate; names.add(i.name); } }));
  $("prods").innerHTML = [...names].map(n => `<option value="${esc(n)}">`).join("");
}

function makeRow(){
  const tr = document.createElement("tr");
  tr.className = "empty";
  tr.innerHTML = `<td class="sl"></td>
    <td><input class="name" list="prods" autocomplete="off" placeholder="Item name"></td>
    <td><input class="n qty" inputmode="decimal"></td>
    <td><input class="n rate" inputmode="decimal"></td>
    <td class="amt"></td>
    <td class="np"><span class="dg" title="Drag to reorder">⠿</span><button class="x" type="button" tabindex="-1" title="Remove row">×</button></td>`;
  return tr;
}
function buildRows(n){
  const tb = $("rows"); tb.innerHTML = "";
  for(let i = 0; i < n; i++) tb.appendChild(makeRow());
}
function addRow(focus = true){
  const tr = makeRow(); tr.classList.add("added"); $("rows").appendChild(tr);
  if(focus) tr.querySelector(".name").focus();
  return tr;
}
$("addRow").onclick = () => addRow();
$("rows").addEventListener("click", e => {
  const b = e.target.closest(".x"); if(!b) return;
  const tr = b.closest("tr");
  if($("rows").children.length <= 1){ tr.querySelectorAll("input").forEach(i => i.value = ""); }
  else { tr.classList.add("gone"); setTimeout(() => { tr.remove(); calc(); }, reduced ? 0 : 180); }
  dirty = true; calc();
});
$("rows").addEventListener("keydown", e => {
  if(e.key !== "Enter" || e.target.tagName !== "INPUT") return;
  e.preventDefault();
  const all = [...$("rows").querySelectorAll("input")];
  const i = all.indexOf(e.target);
  if(all[i+1]) all[i+1].focus(); else addRow();
});
$("rows").addEventListener("change", e => {
  if(!e.target.classList.contains("name")) return;
  const key = e.target.value.trim().toLowerCase();
  if(key in rates){
    const tr = e.target.closest("tr");
    if(!tr.querySelector(".rate").value) tr.querySelector(".rate").value = rates[key];
    if(!tr.querySelector(".qty").value) tr.querySelector(".qty").value = 1;
    calc();
  }
});

let shown = 0, raf = 0, totalNow = 0;
function animateTotal(to){
  cancelAnimationFrame(raf);
  totalNow = to;
  if(reduced){ shown = to; $("total").textContent = rupee(to); return; }
  const from = shown, t0 = performance.now(), dur = 380;
  (function step(t){
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    shown = from + (to - from) * e;
    $("total").textContent = rupee(shown);
    if(p < 1) raf = requestAnimationFrame(step); else shown = to;
  })(t0);
}
function calc(){
  let sub = 0, nItems = 0, qtyTot = 0;
  document.querySelectorAll("#rows tr").forEach(tr => {
    const q = num(tr.querySelector(".qty").value), r = num(tr.querySelector(".rate").value);
    const a = q * r; sub += a;
    tr.querySelector(".amt").textContent = a ? a.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}) : "";
    const filled = !!(tr.querySelector(".name").value.trim() || a);
    tr.classList.toggle("empty", !filled);
    if(filled){ nItems++; qtyTot += q; }
  });
  $("itemSum").innerHTML = nItems ? `<b>${nItems}</b> item${nItems > 1 ? "s" : ""} &nbsp;•&nbsp; Total qty <b>${+qtyTot.toFixed(2)}</b>` : "";
  const dv = num($("discount").value), du = $("discUnit").value;
  $("discount").closest(".row").classList.toggle("zero", !dv);
  $("offer").closest(".row").classList.toggle("zero", !num($("offer").value));
  $("tax").closest(".row").classList.toggle("zero", !num($("tax").value));
  const discAmt = du === "%" ? sub * dv / 100 : dv;
  const offer = num($("offer").value);
  const taxable = Math.max(0, sub - discAmt - offer);
  const tv = num($("tax").value), tu = $("taxUnit").value;
  const taxAmt = tu === "%" ? taxable * tv / 100 : tv;
  const total = Math.round((taxable + taxAmt) * 100) / 100;

  $("subtotal").textContent = rupee(sub);
  $("discHint").textContent = du === "%" && dv ? "− " + rupee(discAmt) : "";
  $("taxHint").textContent = tu === "%" && tv ? "+ " + rupee(taxAmt) : "";
  if(total !== totalNow || !$("total").textContent.trim() ) animateTotal(total);

  const raw = $("paid").value.trim();
  const eff = raw === "" ? (editing ? sumPays(pays) : total) : num(raw);
  const due = Math.max(0, Math.round((total - eff) * 100) / 100);
  const bal = $("balance");
  if(total <= 0){ $("balLabel").textContent = "Balance"; bal.textContent = "—"; bal.className = ""; }
  else if(due > 0.004){ $("balLabel").textContent = "Balance due"; bal.textContent = rupee(due); bal.className = "due"; }
  else if(raw !== "" && num(raw) > total + 0.004){ $("balLabel").textContent = "Change to return"; bal.textContent = rupee(num(raw) - total); bal.className = ""; }
  else { $("balLabel").textContent = "Status"; bal.textContent = "Fully paid ✓"; bal.className = "ok"; }

  const showPay = editing && due > 0.004;
  $("dueBox").hidden = !showPay;
  if(showPay){
    $("dueAmt").textContent = rupee(due);
    const r = $("rcv").value.trim();
    $("payBtn").textContent = "Pay " + rupee(r === "" ? due : Math.min(num(r), due));
  }
  $("payHist").innerHTML = editing && pays.length
    ? "<b>Payment history</b><br>" + pays.map(p => `${esc(p.date)} &nbsp;•&nbsp; <b>${esc(p.kind || "Payment")}</b> ${rupee(p.amt)} (${esc(p.mode)})`).join("<br>")
      + (due > 0.004 ? `<br><b style="color:var(--danger)">Remaining due ${rupee(due)}</b>` : `<br><b style="color:var(--green)">Bill cleared ✓</b>`) : "";

  const pk = raw === "" ? (advMode ? "adv" : "full") : num(raw) <= 0 ? "due" : num(raw) < total - 0.004 ? "adv" : "full";
  $("ptype").hidden = editing;
  document.querySelectorAll("#ptype button").forEach(b => b.classList.toggle("on", b.dataset.k === pk));
  return {sub, discAmt, offer, taxAmt, total, due};
}

function onEdit(e){
  const el = e.target;
  if(el.classList && el.classList.contains("n") && /[০-৯]/.test(el.value)) el.value = norm(el.value);
  if(el.id === "cCar"){ const p = el.selectionStart; el.value = el.value.toUpperCase(); el.setSelectionRange(p, p); }
  if(e.isTrusted && el.id !== "rcv" && el.id !== "rcvMode"){ dirty = true; updateStatus(); }
  calc();
}
["input","change","keyup"].forEach(ev => $("paper").addEventListener(ev, onEdit));

const fmtDate = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}).replace(/ /g,"-");
const fmtTime = d => d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
function tick(){ if(editing) return; const d = new Date(); $("billDate").textContent = fmtDate(d); $("billTime").textContent = fmtTime(d); }
setInterval(tick, 1000);
function updateStatus(){
  const s = $("status");
  if(editing && !dirty){ s.textContent = "Saved ✓"; s.className = "saved"; }
  else if(editing){ s.textContent = "Unsaved changes"; s.className = ""; }
  else { s.textContent = "Draft"; s.className = ""; }
}

function newBill(){
  buildRows(ROWS);
  ["cName","cPhone","cAddr","cCar","discount","offer","tax","paid"].forEach(id => $(id).value = "");
  $("mode").value = "Cash"; $("discUnit").value = "₹"; $("taxUnit").value = "₹";
  $("billNo").textContent = nextNo();
  pays = []; $("rcv").value = ""; advMode = false;
  editing = false; dirty = false; shown = 0; totalNow = -1;
  tick(); calc(); updateStatus();
}
function loadBill(b){
  const n = Math.max(ROWS, b.items.length);
  buildRows(n);
  [...$("rows").children].forEach((tr, i) => {
    const it = b.items[i]; if(!it) return;
    tr.querySelector(".name").value = it.name;
    tr.querySelector(".qty").value = it.qty || "";
    tr.querySelector(".rate").value = it.rate || "";
  });
  $("cName").value = b.customer.name === "Walk-in Customer" ? "" : b.customer.name;
  $("cPhone").value = b.customer.phone || ""; $("cAddr").value = b.customer.address || ""; $("cCar").value = b.customer.carNo || "";
  $("discount").value = b.discountRaw?.v || ""; $("discUnit").value = b.discountRaw?.u || "₹";
  $("offer").value = b.offer || "";
  $("tax").value = b.taxRaw?.v || ""; $("taxUnit").value = b.taxRaw?.u || "₹";
  $("mode").value = b.mode; $("rcvMode").value = b.mode; $("rcv").value = "";
  pays = Array.isArray(b.payments) ? b.payments.map(p => ({...p})) : legacyPays(b);
  $("paid").value = String(sumPays(pays));
  $("billNo").textContent = b.billNo; $("billDate").textContent = b.date; $("billTime").textContent = b.time;
  editing = true; dirty = false; shown = 0; totalNow = -1;
  calc(); updateStatus();
}
function collect(){
  const c = calc();
  const payments = currentPays(c.total);
  const items = [];
  document.querySelectorAll("#rows tr").forEach(tr => {
    const name = tr.querySelector(".name").value.trim();
    const qty = num(tr.querySelector(".qty").value), rate = num(tr.querySelector(".rate").value);
    if(name || qty * rate) items.push({name, qty, rate, amount: qty * rate});
  });
  const now = new Date();
  return {
    billNo: $("billNo").textContent, date: $("billDate").textContent, time: $("billTime").textContent,
    ts: now.getTime(),
    customer: {name: $("cName").value.trim() || "Walk-in Customer", phone: $("cPhone").value.trim(), address: $("cAddr").value.trim(), carNo: $("cCar").value.trim().toUpperCase()},
    items, subtotal: c.sub, discount: c.discAmt, offer: c.offer, tax: c.taxAmt, total: c.total,
    discountRaw: {v: num($("discount").value), u: $("discUnit").value},
    taxRaw: {v: num($("tax").value), u: $("taxUnit").value},
    mode: $("mode").value, paid: sumPays(payments),
    due: Math.max(0, Math.round((c.total - sumPays(payments)) * 100) / 100), payments
  };
}
function persist(){ return store.set("bills", bills) && store.set("counter", counter); }
function save(silent){
  if(editing && !dirty){ if(!silent) toast("Already saved"); return true; }
  const b = collect();
  if(!b.items.length){ toast("Add at least one item first"); return false; }
  const idx = bills.findIndex(x => x.billNo === b.billNo);
  if(idx >= 0){ b.ts = bills[idx].ts; bills[idx] = b; }
  else { bills.unshift(b); counter++; }
  if(!persist()){ toast("Could not save — allow browser storage for this page"); return false; }
  editing = true; dirty = false; pays = b.payments; $("paid").value = String(b.paid);
  tick(); calc(); updateStatus(); buildRates(); refreshCount();
  const st = $("stamp"), isDue = b.due > 0.004;
  st.textContent = isDue ? "DUE" : "PAID"; st.classList.toggle("due", isDue);
  st.classList.remove("go"); void st.offsetWidth; st.classList.add("go");
  toast(isDue ? `Saved ${b.billNo} • Due ${rupee(b.due)}` : `Saved ${b.billNo} ✓ Fully paid`);
  return true;
}
$("saveBtn").onclick = () => save();
$("payBtn").onclick = () => {
  const c = calc(), raw = $("rcv").value.trim();
  const amt = raw === "" ? c.due : Math.min(num(raw), c.due);
  if(!(amt > 0)){ toast("Enter the amount received"); return; }
  pays = [...pays, mkPay(amt, $("rcvMode").value, amt >= c.due - 0.004 ? "Final payment" : "Part payment")];
  $("paid").value = String(sumPays(pays)); $("rcv").value = "";
  dirty = true;
  if(save(true)){
    const after = calc();
    toast(after.due > 0.004 ? `${rupee(amt)} received • ${rupee(after.due)} still due` : `${rupee(amt)} received • Bill fully paid ✓`);
  }
};
$("newBtn").onclick = () => {
  if(dirty && !confirm("This bill has unsaved changes. Start a new bill anyway?")) return;
  newBill(); setTab("bill"); toast("New bill ready");
};
$("printBtn").onclick = () => { if(save(true)) { $("total").textContent = rupee(totalNow); setTimeout(() => window.print(), 60); } };
window.addEventListener("beforeprint", () => { cancelAnimationFrame(raf); $("total").textContent = rupee(totalNow); });

$("size").onchange = e => {
  const v = e.target.value;
  $("pageSize").textContent = v === "80mm" ? "@page{size:80mm auto;margin:2mm}" : `@page{size:${v};margin:8mm}`;
  $("paper").style.maxWidth = v === "80mm" ? "340px" : "860px";
  $("paper").classList.toggle("narrow", v === "80mm");
};

function moveInd(){
  const b = document.querySelector(".tabs button.on");
  $("ind").style.left = b.offsetLeft + "px"; $("ind").style.width = b.offsetWidth + "px";
}
function setTab(name){
  document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  $("tab-bill").hidden = name !== "bill"; $("tab-view").hidden = name !== "view";
  $("saveBtn").hidden = $("printBtn").hidden = $("size").hidden = name !== "bill";
  moveInd();
  if(name === "view") renderView();
}
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => setTab(b.dataset.tab));
addEventListener("resize", moveInd);
if(document.fonts) document.fonts.ready.then(moveInd);

function refreshCount(){ $("cnt").textContent = bills.length; if($("vCnt")) $("vCnt").textContent = bills.length; }
function renderView(){
  if(typeof renderCollect === "function") renderCollect();
  if(typeof renderDash === "function") renderDash();
  const q = norm($("q").value).trim().toLowerCase(), by = $("qBy").value;
  const match = b => {
    if(!q) return true;
    if(by === "no") return b.billNo.toLowerCase().includes(q);
    if(by === "name") return b.customer.name.toLowerCase().includes(q);
    const d = q.replace(/\D/g, ""); return d !== "" && String(b.customer.phone || "").replace(/\D/g, "").includes(d);
  };
  const list = bills.filter(b => (filter === "all" || (filter === "due") === (billDue(b) > 0.004)) && match(b));

  const now = new Date();
  let tS=0,tN=0,mS=0,mN=0,aS=0;
  bills.forEach(b => {
    const d = new Date(b.ts); aS += b.total;
    if(d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth()){ mS += b.total; mN++;
      if(d.getDate()===now.getDate()){ tS += b.total; tN++; } }
  });
  $("stToday").textContent = rupee0(tS); $("stTodayN").textContent = tN + (tN===1?" bill":" bills");
  $("stMonth").textContent = rupee0(mS); $("stMonthN").textContent = mN + (mN===1?" bill":" bills");
  let dS = 0, dN = 0;
  bills.forEach(b => { const d = billDue(b); if(d > 0.004){ dS += d; dN++; } });
  $("stDue").textContent = rupee0(dS); $("stDueN").textContent = dN + (dN === 1 ? " bill pending" : " bills pending");
  $("fAll").textContent = bills.length; $("fDue").textContent = dN; $("fPaid").textContent = bills.length - dN;
  $("stAll").textContent = rupee0(aS); $("stAllN").textContent = bills.length + (bills.length===1?" bill":" bills");
  if(typeof statExtras === "function") statExtras();

  $("billList").innerHTML = list.map((b, i) => {
    const due = billDue(b), paid = billPaid(b), isDue = due > 0.004;
    const digits = String(b.customer.phone || "").replace(/\D/g, "");
    const wa = digits.length >= 10 ? "91" + digits.slice(-10) : "";
    const who = b.customer.name === "Walk-in Customer" ? "Hello" : "Hello " + b.customer.name;
    const msg = `${who}, a gentle reminder from ${shop.name}: your due amount for bill ${b.billNo} is ${rupee(due)}. Please pay at your convenience. Thank you! ${shop.phone || ""}`;
    const status = isDue
      ? `${dueChip(b,due)}<br><small style="color:var(--muted)">Paid ${rupee(paid)} of ${rupee(b.total)}</small>`
      : `<span class="chip ok">PAID ✓</span><br><small style="color:var(--muted)">${esc(b.mode)}</small>`;
    return `
    <tr class="${isDue ? "due" : "paid"}" style="animation-delay:${Math.min(i,12)*30}ms">
      <td class="no">${esc(b.billNo)}</td>
      <td>${esc(b.date)}<br><small style="color:var(--muted)">${esc(b.time)}</small></td>
      <td>${esc(b.customer.name)}${b.customer.carNo ? `<br><span class="plate-chip"><i>IND</i><b>${esc(b.customer.carNo)}</b></span>` : ""}<br><small style="color:var(--muted)">${b.items.length} item${b.items.length===1?"":"s"}${b.customer.phone ? " • " + esc(b.customer.phone) : ""}</small></td>
      <td>${status}</td>
      <td class="r">${rupee(b.total)}${profitLine(b)}</td>
      <td style="white-space:nowrap;text-align:right">
        <button class="btn small ${isDue ? "green" : ""}" data-open="${esc(b.billNo)}">${isDue ? "Open &amp; Pay" : "Open"}</button>
        <button class="btn small amber" data-print="${esc(b.billNo)}" title="Print this bill">🖨 Print</button>
        ${isDue && wa ? `<a class="btn small wa" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}">Remind</a>` : ""}
        <button class="btn small danger" data-del="${esc(b.billNo)}">Delete</button>
      </td>
    </tr>`;
  }).join("");
  $("emptyMsg").hidden = list.length > 0;
  $("emptyMsg").textContent = bills.length ? (filter === "due" && !q ? "No pending dues 🎉" : "No bill matches your search.") : "No bills yet. Save your first bill and it will show up here.";
}
$("q").addEventListener("input", renderView);
$("qBy").addEventListener("change", () => {
  $("q").placeholder = {no:"Search by bill no…", name:"Search by customer name…", phone:"Search by phone number…"}[$("qBy").value];
  renderView();
});
document.querySelectorAll(".filters button").forEach(btn => btn.onclick = () => {
  filter = btn.dataset.f;
  document.querySelectorAll(".filters button").forEach(x => x.classList.toggle("on", x === btn));
  renderView();
});
$("billList").addEventListener("click", e => {
  const o = e.target.closest("[data-open]"), d = e.target.closest("[data-del]"), pr = e.target.closest("[data-print]");
  if(o){ const b = bills.find(x => x.billNo === o.dataset.open); if(b){ loadBill(b); setTab("bill"); window.scrollTo({top:0,behavior:"smooth"}); } }
  if(pr){
    const b = bills.find(x => x.billNo === pr.dataset.print);
    if(b){
      loadBill(b); setTab("bill"); window.scrollTo(0, 0);
      setTimeout(() => { addEventListener("afterprint", () => { setTab("view"); showSub("list"); }, {once: true}); window.print(); }, 550);
    }
  }
  if(d && confirm("Delete bill " + d.dataset.del + "? This cannot be undone.")){
    restoreStock(bills.find(x => x.billNo === d.dataset.del)); bills = bills.filter(x => x.billNo !== d.dataset.del); persist(); buildRates(); refreshCount(); renderView(); toast("Bill deleted");
  }
});

function showSub(v){
  $("subDash").hidden = v !== "dash"; $("subList").hidden = v !== "list";
  document.querySelectorAll("#vtabs button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
}
$("vtabs").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if(b) showSub(b.dataset.v); });

function download(name, text, type){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], {type}));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const stamp = () => new Date().toISOString().slice(0,10);
$("bkBtn").onclick = () => {
  download(`billing-backup-${stamp()}.json`, JSON.stringify({version:1, shop, bills, counter}, null, 1), "application/json");
  toast("Backup downloaded");
};
$("csvBtn").onclick = () => {
  const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Bill No","Date","Time","Customer","Phone","Items","Subtotal","Discount","Offer","Tax","Total","Payment","Paid","Due"];
  const rows = bills.map(b => [b.billNo,b.date,b.time,b.customer.name,b.customer.phone,
    b.items.map(i => `${i.name} x${i.qty}`).join("; "),b.subtotal,b.discount,b.offer,b.tax,b.total,b.mode,billPaid(b),billDue(b)].map(q).join(","));
  download(`bills-${stamp()}.csv`, "\uFEFF" + [head.map(q).join(","), ...rows].join("\r\n"), "text/csv;charset=utf-8");
};
$("rsBtn").onclick = () => $("rsFile").click();
$("rsFile").onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    try{
      const d = JSON.parse(r.result);
      if(!Array.isArray(d.bills)) throw 0;
      const map = new Map(bills.map(b => [b.billNo, b]));
      d.bills.forEach(b => map.set(b.billNo, b));
      bills = [...map.values()].sort((a,b) => b.ts - a.ts);
      counter = Math.max(counter, d.counter || 0, ...bills.map(b => parseInt(String(b.billNo).split("-").pop(),10) || 0));
      if(d.shop){ shop = Object.assign({}, DEFAULT_SHOP, d.shop); store.set("shop2", shop); applyShop(); }
      persist(); buildRates(); refreshCount(); renderView();
      if(!editing) $("billNo").textContent = nextNo();
      toast("Restored " + d.bills.length + " bills");
    }catch(err){ toast("This is not a valid backup file"); }
    e.target.value = "";
  };
  r.readAsText(f);
};

let tmpLogo = "";
const fields = {sName:"name", sCode:"code", sTag:"tagline", sAddr:"address", sPhone:"phone", sEmail:"email", sGst:"gstin", sUpi:"upi", sBrand:"brand", sNotes:"notes", sThanks:"thanks"};
$("setBtn").onclick = () => {
  Object.entries(fields).forEach(([id, k]) => $(id).value = shop[k] || "");
  tmpLogo = shop.logo; setLogo($("sLogoPrev"), tmpLogo);
  $("dlg").showModal();
};
$("sCancel").onclick = () => $("dlg").close();
$("sLogoDel").onclick = () => { tmpLogo = ""; setLogo($("sLogoPrev"), ""); };
$("sLogoFile").onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const img = new Image();
  img.onload = () => {
    const s = Math.min(1, 300 / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    tmpLogo = c.toDataURL("image/png"); setLogo($("sLogoPrev"), tmpLogo);
  };
  img.src = URL.createObjectURL(f);
};
$("sSave").onclick = () => {
  Object.entries(fields).forEach(([id, k]) => shop[k] = $(id).value.trim());
  shop.code = (shop.code || "INV").toUpperCase().replace(/[^A-Z0-9]/g, "");
  shop.logo = tmpLogo;
  if(!store.set("shop2", shop)) toast("Could not store shop details in this browser");
  applyShop(); setLogo($("sLogoPrev"), tmpLogo);
  if(!editing) $("billNo").textContent = nextNo();
  $("dlg").close(); toast("Shop details saved");
};

document.querySelectorAll("#ptype button").forEach(b => b.onclick = () => {
  const k = b.dataset.k; advMode = k === "adv";
  $("paid").value = k === "due" ? "0" : "";
  dirty = true; updateStatus(); calc();
  if(advMode) $("paid").focus();
});

const root = document.documentElement;
const mk = (tag, id, html, cls) => { const e = document.createElement(tag); if(id) e.id = id; if(cls) e.className = cls; if(html) e.innerHTML = html; document.body.appendChild(e); return e; };

function setDark(on){ root.classList.toggle("dark", on); $("themeBtn").textContent = on ? "☀️" : "🌙"; store.set("dark", on); }
$("themeBtn").onclick = () => setDark(!root.classList.contains("dark"));
let wasDark = false;
window.addEventListener("beforeprint", () => { wasDark = root.classList.contains("dark"); root.classList.remove("dark"); });
window.addEventListener("afterprint", () => { if(wasDark) root.classList.add("dark"); });

let soundOn = store.get("sound", true);
function paintSound(){ $("soundBtn").textContent = soundOn ? "🔊" : "🔇"; }
$("soundBtn").onclick = () => { soundOn = !soundOn; store.set("sound", soundOn); paintSound(); if(soundOn) ding(); };
function ding(){
  if(!soundOn) return;
  try{
    const C = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1318].forEach((f, i) => {
      const o = C.createOscillator(), g = C.createGain(), t = C.currentTime + i * .12;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .6);
      o.connect(g); g.connect(C.destination); o.start(t); o.stop(t + .65);
    });
  }catch(e){}
}
const cv = mk("canvas", "confetti"), cx = cv.getContext("2d");
function celebrate(){
  ding();
  if(reduced) return;
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#ff4d2e", "#12b5e5", "#7b4dff", "#12a06b", "#ffc21a"];
  const ps = Array.from({length: 130}, () => ({x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 6, s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[Math.random() * 5 | 0]}));
  const t0 = performance.now();
  (function f(t){
    const k = (t - t0) / 2200; cx.clearRect(0, 0, cv.width, cv.height);
    if(k >= 1) return;
    ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr; cx.save(); cx.globalAlpha = 1 - k * k; cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); });
    requestAnimationFrame(f);
  })(t0);
}
const _save = save;
save = function(silent){
  const fresh = dirty || !editing;
  const ok = _save(silent);
  if(ok && fresh){ const b = bills.find(x => x.billNo === $("billNo").textContent); if(b && b.total > 0 && billDue(b) < 0.005) celebrate(); }
  return ok;
};

let drag = null;
$("rows").addEventListener("pointerdown", e => {
  const h = e.target.closest(".dg"); if(!h) return;
  e.preventDefault(); drag = h.closest("tr"); drag.classList.add("lift"); h.setPointerCapture(e.pointerId);
});
$("rows").addEventListener("pointermove", e => {
  if(!drag) return;
  const el = document.elementFromPoint(e.clientX, e.clientY), over = el && el.closest("#rows tr");
  if(over && over !== drag){ const r = over.getBoundingClientRect(); $("rows").insertBefore(drag, e.clientY > r.top + r.height / 2 ? over.nextSibling : over); }
});
const endDrag = () => { if(!drag) return; drag.classList.remove("lift"); drag = null; dirty = true; updateStatus(); calc(); };
$("rows").addEventListener("pointerup", endDrag);
$("rows").addEventListener("pointercancel", endDrag);

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let vLang = "bn-IN", rec = null;
function parseVoice(t){
  t = norm(t).toLowerCase().replace(/,/g, "");
  const UQ = "(?:পিস|পিছ|টা(?!কা)|টি|খানা|সেট|pcs?|pieces?|nos?|x|sets?)", UR = "(?:টাকা|টাকায়|রুপি|রুপী|rs\\.?|rupees?|taka|₹|inr)", N = "(\\d+(?:\\.\\d+)?)";
  let q = 0, r = 0, m = t.match(new RegExp(N + "\\s*" + UQ));
  if(m) q = +m[1];
  m = t.match(new RegExp(N + "\\s*" + UR)) || t.match(new RegExp("(?:₹|rs\\.?|rupees?)\\s*" + N));
  if(m) r = +m[1];
  const nums = [...t.matchAll(/\d+(?:\.\d+)?/g)].map(x => +x[0]);
  if(!q && !r){ if(nums.length >= 2){ q = nums[0]; r = nums[1]; } else if(nums.length === 1){ q = 1; r = nums[0]; } }
  else if(!q) q = 1;
  else if(!r) r = nums.find(n => n !== q) || 0;
  let name = t.replace(new RegExp(N + "\\s*(?:" + UR + "|" + UQ + ")?", "g"), " ").replace(/₹|\brs\b\.?|\brupees?\b/g, " ").replace(/\s+/g, " ").trim();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return {name, q, r};
}
function voiceFill(text){
  const v = parseVoice(text);
  if(!v.name && !v.r){ toast("বুঝতে পারিনি: " + text); return; }
  let tr = document.querySelector("#rows tr.empty") || addRow(false);
  const key = v.name.toLowerCase();
  if(!v.r && key in rates) v.r = rates[key];
  tr.querySelector(".name").value = v.name;
  tr.querySelector(".qty").value = v.q || 1;
  tr.querySelector(".rate").value = v.r || "";
  dirty = true; updateStatus(); calc();
  toast(`✓ ${v.name} × ${v.q || 1}${v.r ? " @ ₹" + v.r : ""}`);
}
if(!SR){ $("micBtn").hidden = $("micLang").hidden = true; }
else{
  $("micLang").onclick = () => { vLang = vLang === "bn-IN" ? "en-IN" : "bn-IN"; $("micLang").textContent = vLang === "bn-IN" ? "বাংলা" : "English"; };
  $("micBtn").onclick = () => {
    if(rec){ rec.stop(); return; }
    rec = new SR(); rec.lang = vLang; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onstart = () => { $("micBtn").classList.add("on"); toast("বলুন… যেমন: ব্রেক প্যাড ২ পিস ৫০০ টাকা"); };
    rec.onresult = e => voiceFill(e.results[0][0].transcript);
    rec.onerror = e => toast(e.error === "not-allowed" ? "মাইক্রোফোনের অনুমতি দিন" : "শুনতে পাইনি, আবার চেষ্টা করুন");
    rec.onend = () => { $("micBtn").classList.remove("on"); rec = null; };
    rec.start();
  };
}

let lgCust = null;
function lookup(){
  const box = $("ledger"), d = $("cPhone").value.replace(/\D/g, "").slice(-10);
  if(editing || d.length < 6){ box.hidden = true; return; }
  const m = bills.filter(b => String(b.customer.phone || "").replace(/\D/g, "").includes(d));
  if(!m.length){ box.hidden = true; return; }
  lgCust = m[0].customer;
  const sum = m.reduce((s, b) => s + b.total, 0), due = m.reduce((s, b) => s + billDue(b), 0);
  box.innerHTML = `<span style="font-size:22px">👤</span><div class="lg-t"><b>${esc(lgCust.name)}</b> — আগে <b>${m.length}</b> বার কিনেছেন • মোট <b>${rupee0(sum)}</b>${due > 0.004 ? ` • <span class="dn">বাকি ${rupee0(due)}</span>` : " • কোনো বাকি নেই ✓"}</div><button class="btn small" id="lgUse" type="button">Use details</button>`;
  box.hidden = false;
}
$("cPhone").addEventListener("input", lookup);
$("ledger").addEventListener("click", e => {
  if(!e.target.closest("#lgUse") || !lgCust) return;
  if(lgCust.name !== "Walk-in Customer") $("cName").value = lgCust.name;
  $("cAddr").value = lgCust.address || ""; $("cCar").value = lgCust.carNo || "";
  dirty = true; updateStatus(); $("ledger").hidden = true; toast("কাস্টমারের তথ্য বসানো হয়েছে");
});

let qrLast = "";
function qrUpdate(r){
  const box = $("qrBox"), upi = (shop.upi || "").trim(), show = !!upi && r.due > 0.004 && window.QRCode;
  box.hidden = !show;
  if(!show){ qrLast = ""; return; }
  const url = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(shop.name)}&am=${r.due.toFixed(2)}&cu=INR&tn=${encodeURIComponent($("billNo").textContent)}`;
  $("qrAmt").textContent = rupee(r.due);
  if(url !== qrLast){ qrLast = url; $("qrImg").innerHTML = ""; new QRCode($("qrImg"), {text: url, width: 92, height: 92, correctLevel: QRCode.CorrectLevel.M}); }
}
$("shareBtn").onclick = async () => {
  if(!save(true)) return;
  if(!window.html2canvas){ toast("Share করতে প্রথমবার ইন্টারনেট লাগবে"); return; }
  const dark = root.classList.contains("dark"); root.classList.remove("dark"); document.body.classList.add("cap");
  try{
    const canvas = await html2canvas($("paper"), {scale: 2, backgroundColor: "#fff", useCORS: true});
    const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
    const no = $("billNo").textContent, b = bills.find(x => x.billNo === no), due = b ? billDue(b) : 0;
    const text = `${shop.name} • Bill ${no} • Total ${rupee(b ? b.total : 0)}${due > 0.004 ? " • Due " + rupee(due) : " • Paid ✓"}`;
    const file = new File([blob], no + ".png", {type: "image/png"});
    if(navigator.canShare && navigator.canShare({files: [file]})) await navigator.share({files: [file], text, title: no});
    else{
      download(no + ".png", blob, "image/png");
      const d = $("cPhone").value.replace(/\D/g, "");
      window.open(`https://wa.me/${d.length >= 10 ? "91" + d.slice(-10) : ""}?text=${encodeURIComponent(text)}`, "_blank");
      toast("ছবি সেভ হয়েছে — WhatsApp-এ অ্যাটাচ করুন");
    }
  }catch(e){ if(e.name !== "AbortError") toast("Share করা গেল না"); }
  finally{ document.body.classList.remove("cap"); if(dark) root.classList.add("dark"); }
};

const mini = mk("div", "mini", `<div class="mini-h"><span>PREVIEW</span><b id="miBill"></b></div><div id="miItems"></div><div class="mini-t"><span id="miLbl">Total</span><b id="miTot"></b></div>`, "mini");
mini.tabIndex = 0; mini.title = "বড় করে দেখুন";
const pdlg = mk("dialog", "prevDlg", `<div class="rcpt" id="rcpt"></div><div class="df"><button class="btn soft" id="prevClose" type="button">Close</button></div>`);
const rowsNow = () => [...document.querySelectorAll("#rows tr:not(.empty)")].map(tr => ({n: tr.querySelector(".name").value.trim() || "—", q: num(tr.querySelector(".qty").value), r: num(tr.querySelector(".rate").value)}));
function miniUpdate(r){
  const it = rowsNow();
  $("miBill").textContent = $("billNo").textContent;
  $("miItems").innerHTML = it.length ? it.slice(0, 3).map(i => `<div class="mi-r"><span>${esc(i.n)}</span><span>${rupee0(i.q * i.r)}</span></div>`).join("") + (it.length > 3 ? `<div class="mi-m">+${it.length - 3} more…</div>` : "") : `<div class="mi-m">আইটেম যোগ করুন…</div>`;
  const isDue = r.due > 0.004;
  $("miLbl").textContent = isDue ? "Due" : "Total"; $("miTot").textContent = rupee0(isDue ? r.due : r.total); $("miTot").className = isDue ? "due" : "";
}
function openPreview(){
  const c = calc(), it = rowsNow(), raw = $("paid").value.trim();
  const paid = raw === "" ? (editing ? sumPays(pays) : c.total) : Math.min(num(raw), c.total);
  const cn = $("cName").value.trim() || "Walk-in Customer", car = $("cCar").value.trim();
  $("rcpt").innerHTML = `<h3>${esc(shop.name)}</h3><div class="rs">${esc(shop.address)}<br>${esc(shop.phone)}</div>
    <div class="tt"><span><b>${esc($("billNo").textContent)}</b></span><span>${esc($("billDate").textContent)}</span></div>
    <div class="tt"><span>${esc(cn)}</span><span>${esc(car)}</span></div>
    <table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amt</th></tr></thead><tbody>${it.map(i => `<tr><td>${esc(i.n)}</td><td class="r">${i.q}</td><td class="r">${i.r}</td><td class="r">${(i.q * i.r).toLocaleString("en-IN")}</td></tr>`).join("") || `<tr><td colspan="4" style="text-align:center;color:var(--muted)">No items yet</td></tr>`}</tbody></table>
    <div class="tt"><span>Subtotal</span><span>${rupee(c.sub)}</span></div>
    ${c.discAmt ? `<div class="tt"><span>Discount</span><span>− ${rupee(c.discAmt)}</span></div>` : ""}${c.offer ? `<div class="tt"><span>Offer</span><span>− ${rupee(c.offer)}</span></div>` : ""}${c.taxAmt ? `<div class="tt"><span>Tax</span><span>+ ${rupee(c.taxAmt)}</span></div>` : ""}
    <div class="tt gt"><span>TOTAL</span><span>${rupee(c.total)}</span></div>
    <div class="tt"><span>Paid</span><span>${rupee(paid)}</span></div>
    <div class="tt" style="font-weight:800;color:${c.due > 0.004 ? "var(--danger)" : "var(--green)"}"><span>${c.due > 0.004 ? "Due" : "Status"}</span><span>${c.due > 0.004 ? rupee(c.due) : "Fully paid ✓"}</span></div>`;
  pdlg.showModal();
}
mini.onclick = openPreview;
mini.onkeydown = e => { if(e.key === "Enter") openPreview(); };
$("prevClose").onclick = () => pdlg.close();
pdlg.addEventListener("click", e => { if(e.target === pdlg) pdlg.close(); });

const _calc = calc; let lastTot = null;
calc = function(){
  const r = _calc();
  miniUpdate(r); qrUpdate(r);
  if(editing || !$("cPhone").value) $("ledger").hidden = true;
  if(lastTot !== null && r.total !== lastTot){ const t = $("total"); t.classList.remove("pop"); void t.offsetWidth; t.classList.add("pop"); }
  lastTot = r.total;
  return r;
};

let dRange = 7;
const MODE_COL = {Cash:"#12a06b", UPI:"#7b4dff", Card:"#12b5e5", Online:"#ff4d2e"};
function renderDash(){
  const el = $("dash"); if(!el) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({length: dRange}, (_, i) => { const d = new Date(today); d.setDate(d.getDate() - (dRange - 1 - i)); return {d, k: d.toDateString(), v: 0}; });
  const idx = Object.fromEntries(days.map((x, i) => [x.k, i])), items = {}, modes = {};
  bills.forEach(b => {
    const k = new Date(b.ts).toDateString(); if(!(k in idx)) return;
    days[idx[k]].v += b.total;
    (b.items || []).forEach(i => { const n = (i.name || "").trim(); if(n) items[n] = (items[n] || 0) + (i.amount || i.qty * i.rate || 0); });
    (Array.isArray(b.payments) ? b.payments : legacyPays(b)).forEach(p => { modes[p.mode] = (modes[p.mode] || 0) + p.amt; });
  });
  const tot = days.reduce((s, x) => s + x.v, 0), W = 600, H = 170, bw = W / dRange, max = Math.max(...days.map(x => x.v), 1);
  const bars = days.map((x, i) => { const h = x.v / max * (H - 44), lbl = dRange === 7 ? x.d.toLocaleDateString("en-GB", {weekday: "short"}) : (i % 5 === 0 ? x.d.toLocaleDateString("en-GB", {day: "2-digit", month: "short"}) : "");
    return `<rect class="bar" x="${i * bw + bw * .15}" y="${H - 24 - h}" width="${bw * .7}" height="${Math.max(h, x.v ? 3 : 0)}" rx="4" fill="${x.k === today.toDateString() ? "#ff4d2e" : "#12b5e5"}" style="animation-delay:${i * 40}ms"/>${dRange === 7 && x.v ? `<text x="${i * bw + bw / 2}" y="${H - 29 - h}" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">${rupee0(x.v)}</text>` : ""}<text x="${i * bw + bw / 2}" y="${H - 7}" text-anchor="middle" font-size="11" fill="currentColor" opacity=".6">${lbl}</text>`; }).join("");
  const top = Object.entries(items).sort((a, b) => b[1] - a[1]).slice(0, 5), tm = top.length ? top[0][1] : 1;
  const topH = top.length ? top.map(([n, v], i) => `<div class="hb"><span title="${esc(n)}">${esc(n)}</span><em style="width:${Math.max(6, v / tm * 100)}%;animation-delay:${i * 80}ms"></em><b>${rupee0(v)}</b></div>`).join("") : `<div class="dmuted">No data yet</div>`;
  const mt = Object.values(modes).reduce((s, v) => s + v, 0), C = 2 * Math.PI * 38; let acc = 0;
  const donut = mt ? `<div class="dn-wrap"><svg viewBox="0 0 100 100"><g transform="rotate(-90 50 50)">${Object.entries(modes).map(([m, v]) => { const L = v / mt * C, s = `<circle cx="50" cy="50" r="38" fill="none" stroke="${MODE_COL[m] || "#999"}" stroke-width="16" stroke-dasharray="${L} ${C - L}" stroke-dashoffset="${-acc}"/>`; acc += L; return s; }).join("")}</g></svg><div class="lgd">${Object.entries(modes).map(([m, v]) => `<div><i style="background:${MODE_COL[m] || "#999"}"></i>${esc(m)} ${Math.round(v / mt * 100)}%</div>`).join("")}</div></div>` : `<div class="dmuted">No payments yet</div>`;
  el.innerHTML = `<div class="dhead"><span>📊 Sales <small>শেষ ${dRange} দিন: ${rupee0(tot)}</small></span><span class="dseg"><button data-r="7" class="${dRange === 7 ? "on" : ""}">7 days</button> <button data-r="30" class="${dRange === 30 ? "on" : ""}">30 days</button></span></div>
    <div class="dgrid bento"><div class="dcard c-sales"><h4>DAILY SALES</h4><svg viewBox="0 0 ${W} ${H}">${bars}</svg></div><div class="dcard c-top"><h4>TOP ITEMS</h4>${topH}</div><div class="dcard c-pay"><h4>PAYMENT MODE</h4>${donut}</div>${extraCards()}</div>`;
}
$("dash").addEventListener("click", e => { const b = e.target.closest("[data-r]"); if(b){ dRange = +b.dataset.r; renderDash(); } });

document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn,.ptype button,.filters button,.addrow button,.dseg button,.vtabs button"); if(!b || reduced) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement("span");
  sp.className = "rip"; sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(sp); setTimeout(() => sp.remove(), 650);
});
const _setTab = setTab;
setTab = function(name){
  _setTab(name);
  $("shareBtn").hidden = name !== "bill"; mini.hidden = name !== "bill";
  if(name === "view" && !reduced){ const p = document.querySelector(".panel"); p.classList.add("loading"); setTimeout(() => p.classList.remove("loading"), 380); }
};

const TOUR = [
  {s:".cust", t:"১. এখানে কাস্টমারের নাম, ফোন আর গাড়ির নম্বর লিখুন। পুরোনো কাস্টমার হলে ফোন নম্বর লিখলেই তার হিস্ট্রি দেখাবে।"},
  {s:".items", t:"২. এখানে আইটেমের নাম, পরিমাণ আর দাম লিখুন। Enter চাপলে পরের ঘরে যাবে। 🎤 দিয়ে বলেও যোগ করা যায়, আর ⠿ ধরে টেনে সিরিয়াল বদলানো যায়।"},
  {s:".pay", t:"৩. পুরো টাকা, অ্যাডভান্স, নাকি বাকি—এখান থেকে বেছে নিন।"},
  {s:".sum", t:"৪. ডিসকাউন্ট, অফার আর ট্যাক্স দিলে টোটাল নিজে থেকে বদলে যাবে।"},
  {s:"#saveBtn", t:"৫. সব ঠিক থাকলে Save চাপুন। তারপর Print / PDF বা Share দিয়ে কাস্টমারকে বিল দিন।"},
  {s:".tabs", t:"৬. Saved Bills-এ পুরোনো বিল, বাকির তালিকা আর বিক্রির চার্ট পাবেন।"}
];
let ti = 0;
const tour = mk("div", "tour", `<div class="hole"></div><div class="tip"><div class="tt"></div><div class="tb"><small></small><span><button class="btn soft small" id="tSkip" type="button">Skip</button> <button class="btn small" id="tNext" type="button">Next</button></span></div></div>`);
tour.hidden = true;
function tourShow(){
  const st = TOUR[ti], el = document.querySelector(st.s); el.scrollIntoView({block: "center"});
  const r = el.getBoundingClientRect(), hole = tour.querySelector(".hole"), tip = tour.querySelector(".tip");
  Object.assign(hole.style, {left: r.left - 6 + "px", top: r.top - 6 + "px", width: r.width + 12 + "px", height: r.height + 12 + "px"});
  tip.querySelector(".tt").textContent = st.t; tip.querySelector("small").textContent = `${ti + 1} / ${TOUR.length}`;
  $("tNext").textContent = ti === TOUR.length - 1 ? "Done ✓" : "Next →";
  const below = r.bottom + 190 < innerHeight;
  tip.style.top = (below ? r.bottom + 14 : Math.max(10, r.top - 190)) + "px";
  tip.style.left = Math.max(10, Math.min(innerWidth - 310, r.left)) + "px";
}
function tourStart(){ setTab("bill"); window.scrollTo(0, 0); ti = 0; tour.hidden = false; tourShow(); }
function tourEnd(){ tour.hidden = true; store.set("toured", true); }
$("tNext").onclick = () => { if(ti >= TOUR.length - 1) tourEnd(); else{ ti++; tourShow(); } };
$("tSkip").onclick = tourEnd;
$("tourBtn").onclick = tourStart;
addEventListener("resize", () => { if(!tour.hidden) tourShow(); });

const PAY_MODES = ["Cash", "UPI", "Card", "Online"];
function makeSplit(el, getMax, onChange, stop){
  const S = {
    lines: [],
    sum(){ return Math.round(this.lines.reduce((s, l) => s + num(l.amt), 0) * 100) / 100; },
    alloc(max){ let left = max; return this.lines.map(l => { const a = Math.max(0, Math.min(num(l.amt), left)); left -= a; return {mode: l.mode, amt: Math.round(a * 100) / 100}; }).filter(x => x.amt > 0); },
    reset(){ this.lines = [{mode: "Cash", amt: ""}, {mode: "UPI", amt: ""}]; this.render(); },
    foot(){
      const f = el.querySelector(".sp-s"); if(!f) return;
      const max = getMax(), s = this.sum();
      f.innerHTML = `Entered <b>${rupee(s)}</b> • ` + (s > max + .004 ? `<span class="ov">Extra ${rupee(s - max)} (change)</span>` : `Remaining <b>${rupee(Math.max(0, max - s))}</b>`);
    },
    render(){
      el.innerHTML = this.lines.map((l, i) => `<div class="sp-r"><select data-i="${i}">${PAY_MODES.map(m => `<option${m === l.mode ? " selected" : ""}>${m}</option>`).join("")}</select><input class="n" data-i="${i}" inputmode="decimal" placeholder="Amount ₹" value="${esc(l.amt)}"><button type="button" class="x" data-x="${i}" title="Remove">×</button></div>`).join("")
        + `<button type="button" class="linkbtn" data-add>＋ Add another way</button><div class="sp-s"></div>`;
      this.foot();
    }
  };
  el.addEventListener("input", e => {
    const i = e.target.dataset.i; if(i === undefined) return;
    S.lines[i][e.target.tagName === "SELECT" ? "mode" : "amt"] = e.target.value;
    S.foot(); onChange();
  });
  el.addEventListener("change", e => { if(e.target.tagName === "SELECT"){ const i = e.target.dataset.i; S.lines[i].mode = e.target.value; onChange(); } });
  if(stop) ["input", "change", "keyup"].forEach(ev => el.addEventListener(ev, e => e.stopPropagation()));
  el.addEventListener("click", e => {
    const x = e.target.closest("[data-x]"), a = e.target.closest("[data-add]");
    if(x && S.lines.length > 1){ S.lines.splice(+x.dataset.x, 1); S.render(); onChange(); }
    if(a && S.lines.length < 6){
      const rem = Math.max(0, Math.round((getMax() - S.sum()) * 100) / 100), used = S.lines.map(l => l.mode);
      S.lines.push({mode: PAY_MODES.find(m => !used.includes(m)) || "Cash", amt: rem ? String(rem) : ""});
      S.render(); onChange();
    }
  });
  S.reset();
  return S;
}
let splitMode = false, rcvOn = false, lastDue = 0;
const splitA = makeSplit($("splitBox"), () => Math.max(0, lastTot || 0), () => { $("paid").value = String(splitA.sum() || 0); calc(); }, false);
const splitB = makeSplit($("rcvSplit"), () => lastDue, () => { $("rcv").value = String(splitB.sum() || 0); calc(); }, true);

function setSplit(on, recalc = true){
  splitMode = on;
  $("splitBox").hidden = !on; $("modeRow").hidden = on; $("paid").readOnly = on;
  if(on){ $("paid").value = String(splitA.sum() || 0); splitA.render(); }
  if(recalc) calc();
}
document.querySelectorAll("#ptype button").forEach(b => b.addEventListener("click", () => setSplit(b.dataset.k === "split")));
function rcvReset(){
  rcvOn = false; $("rcvSplit").hidden = true; $("rcv").readOnly = false; $("rcv").value = "";
  $("rcvMode").closest(".row").hidden = false; $("rcvSplitBtn").textContent = "＋ Split into multiple ways"; splitB.reset();
}
$("rcvSplitBtn").onclick = () => {
  rcvOn = !rcvOn; $("rcvSplit").hidden = !rcvOn; $("rcv").readOnly = rcvOn;
  $("rcvMode").closest(".row").hidden = rcvOn;
  $("rcvSplitBtn").textContent = rcvOn ? "✕ Single payment" : "＋ Split into multiple ways";
  splitB.reset(); $("rcv").value = rcvOn ? "0" : ""; calc();
};

const _currentPays = currentPays;
currentPays = function(total){
  if(!editing && splitMode){
    const parts = splitA.alloc(total), sum = sumPays(parts), kind = sum < total - 0.004 ? "Advance" : "Payment";
    return parts.map(p => mkPay(p.amt, p.mode, kind));
  }
  return _currentPays(total);
};
const _payClick = $("payBtn").onclick;
$("payBtn").onclick = () => {
  if(!rcvOn) return _payClick();
  const c = calc(), parts = splitB.alloc(c.due);
  if(!parts.length){ toast("Enter the amount received"); return; }
  const sum = sumPays(parts), kind = sum >= c.due - 0.004 ? "Final payment" : "Part payment";
  pays = [...pays, ...parts.map(p => mkPay(p.amt, p.mode, kind))];
  $("paid").value = String(sumPays(pays)); dirty = true;
  rcvReset();
  if(save(true)){ const after = calc(); toast(after.due > 0.004 ? `${rupee(sum)} received • ${rupee(after.due)} still due` : `${rupee(sum)} received • Bill fully paid ✓`); }
};
const _collect = collect;
collect = function(){
  const b = _collect(), ms = [...new Set((b.payments || []).map(p => p.mode))];
  if(ms.length) b.mode = ms.join(" + ");
  return b;
};
const _loadBill = loadBill;
loadBill = function(b){
  _loadBill(b);
  const m = (pays[0] && pays[0].mode) || "Cash";
  if(!$("mode").value) $("mode").value = m;
  if(!$("rcvMode").value) $("rcvMode").value = m;
  setSplit(false, false); rcvReset(); splitA.reset(); calc();
};
const _newBill = newBill;
newBill = function(){ _newBill(); setSplit(false, false); rcvReset(); splitA.reset(); calc(); };
const _calc2 = calc;
calc = function(){
  const r = _calc2(); lastDue = r.due;
  if(editing && splitMode) setSplit(false, false);
  if(splitMode) document.querySelectorAll("#ptype button").forEach(b => b.classList.toggle("on", b.dataset.k === "split"));
  splitA.foot(); splitB.foot();
  return r;
};

let cMode = store.get("cmode", "comb");
function renderCollect(){
  const el = $("collect"); if(!el) return;
  const now = new Date(), T = {}, M = {};
  bills.forEach(b => (Array.isArray(b.payments) ? b.payments : legacyPays(b)).forEach(p => {
    const d = new Date(p.ts), m = PAY_MODES.includes(p.mode) ? p.mode : "Cash";
    if(d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()){
      M[m] = (M[m] || 0) + p.amt;
      if(d.getDate() === now.getDate()) T[m] = (T[m] || 0) + p.amt;
    }
  }));
  const COL = {Cash: "#12a06b", Digital: "#7b4dff", UPI: "#7b4dff", Card: "#12b5e5", Online: "#ff4d2e"};
  const rowsOf = o => cMode === "comb"
    ? [["Cash", o.Cash || 0], ["Digital", (o.UPI || 0) + (o.Card || 0) + (o.Online || 0), "UPI + Card + Online"]]
    : PAY_MODES.map(m => [m, o[m] || 0]);
  const card = (title, o) => {
    const rows = rowsOf(o), tot = rows.reduce((s, r) => s + r[1], 0) || 1, all = Object.values(o).reduce((s, v) => s + v, 0);
    return `<div class="ccard"><h4>${title}</h4><div class="cbig">${rupee0(all)}</div>${rows.map(([n, v, sub]) => `<div class="crow"><i style="background:${COL[n]}"></i><span>${n}${sub ? `<small>${sub}</small>` : ""}</span><em style="width:${Math.max(v ? 4 : 0, v / tot * 100)}%;background:${COL[n]}"></em><b>${rupee0(v)}</b></div>`).join("")}</div>`;
  };
  el.innerHTML = `<div class="dhead"><span>💰 Collection <small>(টাকা কোন মাধ্যমে এসেছে)</small></span><span class="dseg"><button data-c="comb" class="${cMode === "comb" ? "on" : ""}">Combined</button> <button data-c="sep" class="${cMode === "sep" ? "on" : ""}">Separate</button></span></div>
    <div class="cgrid">${card("TODAY'S COLLECTION", T)}${card("THIS MONTH'S COLLECTION", M)}</div>`;
}
$("collect").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if(b){ cMode = b.dataset.c; store.set("cmode", cMode); renderCollect(); } });

const pk = s => String(s || "").trim().toLowerCase();
let products = store.get("products", []);
const saveProducts = () => store.set("products", products);
const lowAt = p => p.stock != null && p.stock <= (p.min ?? 3);
const qtyMap = items => { const m = {}; (items || []).forEach(i => { const k = pk(i.name); if(k) m[k] = (m[k] || 0) + (i.qty || 0); }); return m; };

mk("dialog", "prodDlg", `<div class="dh">📦 Products &amp; stock</div>
  <div class="db">
    <label class="full">Product name<input id="pName"></label>
    <label>Selling price ₹<input id="pPrice" inputmode="decimal"></label>
    <label>Cost price ₹ (private)<input id="pCost" inputmode="decimal"></label>
    <label>Stock qty (blank = don't track)<input id="pStock" inputmode="decimal"></label>
    <label>Low-stock alert at<input id="pMin" inputmode="decimal" placeholder="3"></label>
  </div>
  <div class="df" style="justify-content:space-between"><button class="btn soft" id="pClear" type="button">Clear</button><button class="btn" id="pAdd" type="button">Add product</button></div>
  <div class="plist" id="pList"></div>
  <div class="df"><button class="btn soft" id="pClose" type="button">Close</button></div>`);
let editId = null;
const optNum = v => String(v).trim() === "" ? null : num(v);
function pForm(p){
  $("pName").value = p ? p.name : ""; $("pPrice").value = p ? p.price : ""; $("pCost").value = p && p.cost ? p.cost : "";
  $("pStock").value = p && p.stock != null ? p.stock : ""; $("pMin").value = p && p.min != null ? p.min : "";
  editId = p ? p.id : null; $("pAdd").textContent = p ? "Update product" : "Add product";
}
function renderProducts(){
  $("pList").innerHTML = products.length ? `<table><thead><tr><th>Product</th><th class="r">Price</th><th class="r">Cost</th><th class="r">Stock</th><th></th></tr></thead><tbody>${products.map(p => `<tr><td>${esc(p.name)}</td><td class="r">${rupee0(p.price)}</td><td class="r">${p.cost ? rupee0(p.cost) : "—"}</td><td class="r">${p.stock == null ? "—" : `<span class="sb${lowAt(p) ? " low" : ""}">${p.stock}</span>`}</td><td class="r"><button class="btn small soft" data-pe="${p.id}" type="button">Edit</button> <button class="btn small danger" data-pd="${p.id}" type="button">×</button></td></tr>`).join("")}</tbody></table>` : `<div class="dmuted">No products yet. Add your first one above.</div>`;
  const n = products.filter(lowAt).length, bd = $("lowBadge"); bd.hidden = !n; bd.textContent = n;
}
$("prodBtn").onclick = () => { pForm(null); renderProducts(); $("prodDlg").showModal(); };
$("pClose").onclick = () => $("prodDlg").close();
$("pClear").onclick = () => pForm(null);
$("pAdd").onclick = () => {
  const name = $("pName").value.trim(); if(!name){ toast("Enter a product name"); return; }
  const d = {name, price: num($("pPrice").value), cost: num($("pCost").value), stock: optNum($("pStock").value), min: optNum($("pMin").value)};
  let p = products.find(x => x.id === editId) || products.find(x => pk(x.name) === pk(name));
  if(p) Object.assign(p, d); else products.push({id: Date.now().toString(36), ...d});
  saveProducts(); pForm(null); renderProducts(); renderQuick(); buildRates(); toast("Product saved");
};
$("pList").addEventListener("click", e => {
  const ed = e.target.closest("[data-pe]"), dl = e.target.closest("[data-pd]");
  if(ed) pForm(products.find(p => p.id === ed.dataset.pe));
  if(dl && confirm("Delete this product?")){ products = products.filter(p => p.id !== dl.dataset.pd); saveProducts(); renderProducts(); renderQuick(); }
});

function renderQuick(){
  const q = $("quick"); q.hidden = false;
  if(!products.length){ q.innerHTML = `<div class="q-empty">📦 Add your products once for one-tap billing and stock tracking. <button type="button" class="linkbtn" data-open>Add products</button></div>`; return; }
  const sold = {}; bills.forEach(b => (b.items || []).forEach(i => { const k = pk(i.name); sold[k] = (sold[k] || 0) + (i.qty || 0); }));
  const list = [...products].sort((a, b) => (sold[pk(b.name)] || 0) - (sold[pk(a.name)] || 0) || a.name.localeCompare(b.name));
  q.innerHTML = `<div class="q-h"><b>⚡ Quick add</b><small>best sellers first</small><button type="button" class="linkbtn" data-open>Manage products</button></div><div class="q-row">${list.map(p => `<button type="button" class="qc${lowAt(p) ? " lowc" : ""}" data-p="${p.id}"><b>${esc(p.name)}</b><span>${rupee0(p.price)}</span>${p.stock != null ? `<small>${p.stock <= 0 ? "Out of stock" : p.stock + " left"}</small>` : ""}</button>`).join("")}</div>`;
}
$("quick").addEventListener("click", e => {
  if(e.target.closest("[data-open]")){ $("prodBtn").click(); return; }
  const c = e.target.closest("[data-p]"); if(!c) return;
  const p = products.find(x => x.id === c.dataset.p); if(!p) return;
  let tr = [...document.querySelectorAll("#rows tr")].find(r => pk(r.querySelector(".name").value) === pk(p.name));
  if(tr){ const q = tr.querySelector(".qty"); q.value = (num(q.value) || 0) + 1; }
  else{ tr = document.querySelector("#rows tr.empty") || addRow(false); tr.querySelector(".name").value = p.name; tr.querySelector(".qty").value = 1; tr.querySelector(".rate").value = p.price; }
  tr.classList.remove("added"); void tr.offsetWidth; tr.classList.add("added");
  dirty = true; updateStatus(); calc();
  const need = num(tr.querySelector(".qty").value);
  if(p.stock != null && need > p.stock) toast(`Only ${p.stock} of ${p.name} in stock`);
});
const _buildRates = buildRates;
buildRates = function(){
  _buildRates();
  products.forEach(p => { rates[pk(p.name)] = p.price; });
  $("prods").innerHTML += products.filter(p => !bills.some(b => (b.items || []).some(i => pk(i.name) === pk(p.name)))).map(p => `<option value="${esc(p.name)}">`).join("");
};

function stockMove(oldItems, newItems){
  const o = qtyMap(oldItems), n = qtyMap(newItems), low = [];
  new Set([...Object.keys(o), ...Object.keys(n)]).forEach(k => {
    const p = products.find(x => pk(x.name) === k); if(!p || p.stock == null) return;
    p.stock = Math.round((p.stock + (o[k] || 0) - (n[k] || 0)) * 100) / 100;
    if((n[k] || 0) > (o[k] || 0) && lowAt(p)) low.push(`${p.name} (${p.stock} left)`);
  });
  saveProducts(); renderQuick(); renderProducts();
  if(low.length) setTimeout(() => toast("⚠ Low stock: " + low.join(", ")), 1400);
}
function restoreStock(b){ if(b) stockMove(b.items, []); }
const _save3 = save;
save = function(silent){
  const old = bills.find(b => b.billNo === $("billNo").textContent), oldItems = old ? old.items : [];
  const ok = _save3(silent), nb = bills.find(b => b.billNo === $("billNo").textContent);
  if(ok && nb && nb !== old){ stockMove(oldItems, nb.items); renderQuick(); }
  return ok;
};

const _collect3 = collect;
collect = function(){
  const b = _collect3(); b.promise = $("promise").value || "";
  let cost = 0, any = false;
  b.items.forEach(i => { const p = products.find(x => pk(x.name) === pk(i.name)); if(p && p.cost > 0){ cost += p.cost * i.qty; any = true; i.cost = p.cost; } });
  if(any){ b.hasCost = true; b.cost = cost; b.profit = Math.round(((b.total - b.tax) - cost) * 100) / 100; }
  return b;
};
const _lb3 = loadBill;
loadBill = function(b){ _lb3(b); $("promise").value = b.promise || ""; calc(); };
const _nb3 = newBill;
newBill = function(){ _nb3(); $("promise").value = ""; calc(); };
const _calc3 = calc;
calc = function(){
  const r = _calc3();
  $("promiseRow").hidden = !(r.due > 0.004); $("promiseRow").classList.toggle("nodate", !$("promise").value);
  return r;
};
function dueChip(b, due){
  let x = `<span class="chip due">DUE ${rupee(due)}</span>`;
  if(b.promise){
    const d = new Date(b.promise + "T00:00:00"), t = new Date(); t.setHours(0, 0, 0, 0); const days = Math.round((t - d) / 864e5);
    x += days > 0 ? ` <span class="chip od">Overdue ${days}d</span>` : days === 0 ? ` <span class="chip td">Pays today</span>` : ` <span class="chip pm">By ${d.toLocaleDateString("en-GB", {day: "2-digit", month: "short"})}</span>`;
  }
  return x;
}
const profitLine = b => b.hasCost ? `<br><small class="pf">Profit ${rupee0(b.profit)}</small>` : "";

function extraCards(){
  const now = new Date(); let pT = 0, pM = 0;
  bills.forEach(b => { if(!b.hasCost) return; const d = new Date(b.ts); if(d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()){ pM += b.profit; if(d.getDate() === now.getDate()) pT += b.profit; } });
  const profit = bills.some(b => b.hasCost) ? `<div class="cbig">${rupee0(pT)}</div><small class="dmuted2">today</small><div class="pm2">This month <b>${rupee0(pM)}</b></div>` : `<div class="dmuted">Add cost prices in <b>📦 Products</b> to see profit.</div>`;
  const low = products.filter(lowAt).slice(0, 5), stock = low.length ? low.map(p => `<div class="lw"><span>${esc(p.name)}</span><b class="sb low">${p.stock}</b></div>`).join("") : `<div class="dmuted">${products.length ? "All stocked ✓" : "No products yet"}</div>`;
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const fu = bills.filter(b => billDue(b) > 0.004).map(b => ({b, d: b.promise ? Math.round((t0 - new Date(b.promise + "T00:00:00")) / 864e5) : null})).sort((a, c) => (c.d ?? -999) - (a.d ?? -999));
  const fuH = fu.length ? fu.slice(0, 4).map(({b, d}) => `<div class="fu"><span>${esc(b.customer.name)}<small>${esc(b.billNo)}</small></span><b>${rupee0(billDue(b))}</b><em class="tg ${d > 0 ? "od" : d === 0 ? "td" : ""}">${d == null ? "no date" : d > 0 ? "Overdue " + d + "d" : d === 0 ? "Today" : "In " + (-d) + "d"}</em></div>`).join("") + (fu.length > 4 ? `<div class="dmuted">+${fu.length - 4} more in View Bills → Due</div>` : "") : `<div class="dmuted">No pending dues 🎉</div>`;
  return `<div class="dcard c-profit"><h4>PROFIT</h4>${profit}</div><div class="dcard c-stock"><h4>LOW STOCK</h4>${stock}</div><div class="dcard c-follow"><h4>COLLECT / FOLLOW-UP</h4>${fuH}</div>`;
}

const dayKey = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
function series(n){ const t = dayKey(Date.now()), a = Array(n).fill(0); bills.forEach(b => { const i = Math.round((t - dayKey(b.ts)) / 864e5); if(i >= 0 && i < n) a[n - 1 - i] += b.total; }); return a; }
function statExtras(){
  const s7 = series(7), s30 = series(30), cum = s30.reduce((a, v, i) => (a.push((a[i - 1] || 0) + v), a), []), tod = s7[6], yes = s7[5];
  if(yes > 0){ const p = Math.round((tod - yes) / yes * 100); $("stTodayN").innerHTML += ` <span class="tr">${p >= 0 ? "▲" : "▼"} ${Math.abs(p)}% vs yesterday</span>`; }
  else if(tod > 0) $("stTodayN").innerHTML += ` <span class="tr">▲ new</span>`;
  [["stToday", s7], ["stMonth", s30], ["stAll", cum]].forEach(([id, a]) => {
    const st = $(id).closest(".stat"), old = st.querySelector(".spark"); if(old) old.remove();
    const mx = Math.max(...a, 1), pts = a.map((v, i) => `${(i / (a.length - 1) * 100).toFixed(1)},${(26 - v / mx * 24).toFixed(1)}`).join(" ");
    st.insertAdjacentHTML("beforeend", `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`);
  });
}
function countUp(){
  ["stToday", "stMonth", "stAll", "stDue"].forEach(id => {
    const el = $(id), to = num(el.textContent.replace(/[₹,]/g, "")), t0 = performance.now();
    (function f(t){ const p = Math.min(1, (t - t0) / 800); el.textContent = rupee0(to * (1 - Math.pow(1 - p, 3))); if(p < 1) requestAnimationFrame(f); })(t0);
  });
}
const _setTab3 = setTab;
setTab = function(n){ _setTab3(n); if(n === "view" && !reduced) countUp(); };

const hexHsl = h => { const r = parseInt(h.slice(1, 3), 16) / 255, g = parseInt(h.slice(3, 5), 16) / 255, b = parseInt(h.slice(5, 7), 16) / 255, M = Math.max(r, g, b), m = Math.min(r, g, b), d = M - m, l = (M + m) / 2; let H = 0, S = 0; if(d){ S = d / (1 - Math.abs(2 * l - 1)); H = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; H = Math.round(H * 60); if(H < 0) H += 360; } return [H, Math.round(S * 100), Math.round(l * 100)]; };
function brandColor(c){
  c = /^#[0-9a-f]{6}$/i.test(c || "") ? c : "#ff4d2e";
  const [h, s, l] = hexHsl(c), st = root.style;
  st.setProperty("--teal", c); st.setProperty("--teal-d", `hsl(${h} ${s}% ${Math.max(l - 10, 15)}%)`);
  st.setProperty("--mint", `hsl(${h} 100% 96%)`); st.setProperty("--g1", `linear-gradient(135deg,${c},hsl(${(h + 32) % 360} ${s}% ${l}%))`);
}
const _applyShop = applyShop;
applyShop = function(){ _applyShop(); brandColor(shop.brand); };
$("swatches").innerHTML = ["#ff4d2e", "#7b4dff", "#12a06b", "#0a8fb5", "#e0268f", "#f59e0b", "#1d4ed8"].map(c => `<button type="button" class="sw" data-c="${c}" style="background:${c}" title="${c}"></button>`).join("");
$("swatches").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if(b){ $("sBrand").value = b.dataset.c; brandColor(b.dataset.c); } });
$("sBrand").addEventListener("input", e => brandColor(e.target.value));
$("dlg").addEventListener("close", () => brandColor(shop.brand));

renderQuick(); renderProducts();

let AC = null;
function tone(f, t0, d, type = "sine", v = .12, f2){
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if(AC.state === "suspended") AC.resume();
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t); if(f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .03);
  }catch(e){}
}
const SFX = {
  tick:  () => tone(1250, 0, .05, "triangle", .07),
  pop:   () => tone(480, 0, .13, "sine", .14, 920),
  add:   () => { tone(660, 0, .08, "triangle", .1); tone(990, .07, .12, "triangle", .1); },
  save:  () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * .07, .22, "sine", .12)),
  coin:  () => { tone(988, 0, .07, "square", .05); tone(1319, .07, .28, "square", .05); },
  del:   () => tone(320, 0, .2, "sawtooth", .06, 110),
  tab:   () => tone(420, 0, .16, "sine", .1, 840),
  toggle:() => { tone(700, 0, .06, "triangle", .1); tone(940, .06, .08, "triangle", .1); },
  open:  () => tone(540, 0, .12, "sine", .1, 800),
  mic:   () => { tone(820, 0, .08, "sine", .1); tone(1230, .09, .14, "sine", .1); }
};
const SFX_MAP = [["#saveBtn", "save"], ["#pAdd", "save"], ["#sSave", "save"], ["#payBtn", "coin"], ["#printBtn", "open"], ["[data-print]", "open"], ["#shareBtn", "open"],
  ["#newBtn", "pop"], ["#addRow", "add"], [".qc", "add"], ["#lgUse", "add"], ["[data-del]", "del"], [".x", "del"], [".tabs button", "tab"], ["#vtabs button", "tab"],
  ["#themeBtn", "toggle"], ["#soundBtn", "toggle"], ["#micBtn", "mic"], ["#micLang", "toggle"], ["#ptype button", "pop"], ["[data-open]", "open"], ["#setBtn", "open"], ["#prodBtn", "open"],
  ["#tourBtn", "pop"], ["#tNext", "tick"], [".filters button", "tick"], [".dseg button", "tick"], [".btn,button", "tick"]];
document.addEventListener("click", e => {
  if(!soundOn) return;
  for(const [s, n] of SFX_MAP) if(e.target.closest(s)){ SFX[n](); return; }
}, true);

document.addEventListener("pointermove", e => {
  if(reduced || e.pointerType === "touch") return;
  const c = e.target.closest(".stat,.ccard,.dcard,.qc"); if(!c) return;
  const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  c.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(1)}deg) rotateY(${(x * 9).toFixed(1)}deg) translateY(-3px)`;
});
document.addEventListener("pointerout", e => { const c = e.target.closest(".stat,.ccard,.dcard,.qc"); if(c && !c.contains(e.relatedTarget)) c.style.transform = ""; });

function buildContact(){
  const c = [], digits = (shop.phone || "").replace(/\D/g, ""), wa = digits.length >= 10 ? "91" + digits.slice(-10) : digits;
  if(shop.address) c.push(`<a class="cc cc-ad cc-wide" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}" title="Open in Google Maps">${ICON.pin}<span class="ct"><small>Visit us</small><b>${esc(shop.address)}</b></span></a>`);
  if(shop.phone){
    c.push(`<a class="cc cc-wa" target="_blank" rel="noopener" href="https://wa.me/${wa}" title="Chat on WhatsApp">${ICON.wa}<span class="ct"><small>WhatsApp</small><b>${esc(shop.phone)}</b></span></a>`);
    c.push(`<a class="cc cc-cl" href="tel:+${wa}" title="Call now">${ICON.call}<span class="ct"><small>Call us</small><b>${esc(shop.phone)}</b></span></a>`);
  }
  if(shop.email) c.push(`<a class="cc cc-ml" href="mailto:${esc(shop.email)}" title="Send an email">${ICON.mail}<span class="ct"><small>Email</small><b>${esc(shop.email)}</b></span></a>`);
  if(shop.gstin) c.push(`<div class="cc cc-gs"><span class="ic i-gs"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 9h6M9 13h4"/></svg></span><span class="ct"><small>GSTIN</small><b>${esc(shop.gstin)}</b></span></div>`);
  const el = $("contact"); el.classList.add("cards");
  el.innerHTML = c.map((x, i) => x.replace("class=\"cc ", `style="--i:${i}" class="cc `)).join("");
}
const _applyShop2 = applyShop;
applyShop = function(){ _applyShop2(); buildContact(); };

setDark(store.get("dark", false)); paintSound();

applyShop(); buildRates(); refreshCount(); newBill(); setTab("bill");
try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
if(!store.get("toured", false)) setTimeout(tourStart, 900);
