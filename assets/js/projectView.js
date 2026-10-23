var id = Number.parseInt(window.location.href.split("id=")[1]);

fetch("projects-data.json").then(response => response.json()).then(data => {
	let entry = data[id]
    
    if (entry.stepFile) {
        document.getElementById("stepViewerFrame").src = "viewer.html?f=" + entry.stepFile;
    } else {
        document.getElementById("stepViewerFrame").style.display = "none";
    }
    for (spec of entry.specs) {
        const li = document.createElement("li");
        li.textContent = spec;
        document.getElementById("specsList").appendChild(li);
    }

    for (img of entry.photos) {
        const imgElement = document.createElement("img");
        imgElement.src = "projects/imgs/" + img;
        document.getElementById("projectImgs").appendChild(imgElement);
    }

    document.getElementById("projectTitle").textContent = entry.title;
    
    Array.from(document.getElementById("projectImgs").getElementsByTagName("img")).forEach(img => {
        img.addEventListener("click", () => {
            if (!img.classList.contains("fullscreen")) {
                img.classList.add("fullscreen");
            } else {
                img.classList.remove("fullscreen");
            }
        });
    });
});

function mk(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }
function addTag(card, label, text) { card.appendChild(mk("span", "tag", label)); card.appendChild(mk("p", "", text)); }
function renderSections(entry) { var box = mk("div", "sections"); if (entry.summary) box.appendChild(mk("p", "summary", entry.summary)); if (entry.stats) { var st = mk("div", "stats"); entry.stats.forEach(function (s) { var c = mk("div", "stat"); c.appendChild(mk("b", "", s.value)); c.appendChild(mk("span", "", s.label)); st.appendChild(c); }); box.appendChild(st); } entry.sections.forEach(function (sec, i) { var h = mk("div", "sec"); h.appendChild(mk("small", "", "0" + (i + 1))); h.appendChild(mk("h2", "", sec.title)); box.appendChild(h); var grid = mk("div", "cardGrid"); sec.cards.forEach(function (cd) { var c = mk("div", "card"); if (cd.title) c.appendChild(mk("h3", "", cd.title)); if (cd.items) { var ul = mk("ul"); cd.items.forEach(function (t) { ul.appendChild(mk("li", "", t)); }); c.appendChild(ul); } if (cd.decision) addTag(c, "Decision", cd.decision); if (cd.why) addTag(c, "Why", cd.why); if (cd.figure) { var im = mk("img", "cardFig"); im.src = "projects/imgs/" + cd.figure; im.addEventListener("click", function () { im.classList.toggle("fullscreen"); }); c.appendChild(im); } grid.appendChild(c); }); box.appendChild(grid); }); if (entry.note) box.appendChild(mk("p", "note", entry.note)); var g = document.querySelector(".projGallery"); g.parentNode.insertBefore(box, g); document.querySelector(".specs").style.display = "none"; if (!entry.photos || !entry.photos.length) g.style.display = "none"; }
fetch("projects-data.json").then(function (r) { return r.json(); }).then(function (data) { var e = data[id]; if (e && e.sections) renderSections(e); });

(function () { var PDF = "projects/imgs/Powertrain PDR 26-27.pdf", CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/", P = null; function lib() { if (P) return P; P = new Promise(function (res, rej) { var s = document.createElement("script"); s.src = CDN + "pdf.min.js"; s.onload = function () { pdfjsLib.GlobalWorkerOptions.workerSrc = CDN + "pdf.worker.min.js"; pdfjsLib.getDocument(encodeURI(PDF)).promise.then(res, rej); }; s.onerror = rej; document.head.appendChild(s); }); return P; } function crop(page, box, cap) { var w = mk("figure", "pdfFig"), cv = mk("canvas"); w.appendChild(cv); if (cap) w.appendChild(mk("figcaption", "", cap)); lib().then(function (d) { return d.getPage(page); }).then(function (pg) { var v = pg.getViewport({ scale: 1 }), bw = box[2] - box[0], bh = box[3] - box[1], vp = pg.getViewport({ scale: 1600 / (v.width * bw) }); cv.width = Math.round(vp.width * bw); cv.height = Math.round(vp.height * bh); pg.render({ canvasContext: cv.getContext("2d"), viewport: vp, transform: [1, 0, 0, 1, -vp.width * box[0], -vp.height * box[1]] }); }).catch(function () { w.style.display = "none"; }); return w; } var CARDS = { "Diff off the back": [[6, [0.06, 0.37, 0.96, 0.92], "Diff-off-the-back trade study: rear-box mass and option scoring"]], "Gear ratio: 43:13 (3.3)": [[7, [0.31, 0.47, 0.945, 0.92], "Quasi-steady-state sweep of 75 m acceleration time and finish speed"]], "Inverter placement": [[8, [0.08, 0.22, 0.89, 0.92], "SpaceClaim packaging: Orion-style vs floor inverter"], [9, [0.06, 0.03, 0.96, 0.935], "Weighted architecture concept scoring and CG delta"], [19, [0.42, 0.2, 0.94, 0.69], "Inverter mounting plan with flipped inverter"]], "Motor mount and brake rotor": [[13, [0.22, 0.42, 0.76, 0.92], "Motor assembly: triangle mount and brake rotor placement"]], "Halfshafts and diff assembly": [[14, [0.13, 0.4, 0.82, 0.85], "Tripod joint efficiency vs angle and max halfshaft angle"]], "Diff mounts and chain tensioning": [[17, [0.58, 0.04, 0.96, 0.92], "Diff mount layout and chain-tension extension"]] }, SECS = { "Problem & Constraints": [[2, [0.055, 0.2, 0.945, 0.93], "High-level goals decomposed into drivetrain requirements"]], "Results": [[10, [0.19, 0.44, 0.76, 0.92], "Final architecture: motor, diff, halfshafts, and flipped inverter"]] }; function go() { document.querySelectorAll(".sections .card").forEach(function (c) { var h = c.querySelector("h3"), l = h && CARDS[h.textContent]; if (l) l.forEach(function (f) { c.appendChild(crop(f[0], f[1], f[2])); }); }); document.querySelectorAll(".sections .sec").forEach(function (s) { var h = s.querySelector("h2"), l = h && SECS[h.textContent], g = s.nextElementSibling; if (l && g) l.forEach(function (f) { g.parentNode.insertBefore(crop(f[0], f[1], f[2]), g); }); }); } var n = 0, t = setInterval(function () { n++; if (document.querySelector(".sections .card")) { clearInterval(t); go(); } else if (n > 50) clearInterval(t); }, 100); })();
(function () { var s = document.createElement("style"); s.textContent = ".sections .card { min-width: 0; } .sections .cardGrid { grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); align-items: start; } .pdfFig { margin: 16px 0 0; background: #fff; border-radius: 10px; overflow: hidden; max-width: 100%; } .pdfFig canvas { display: block; width: 100%; height: auto; } .pdfFig figcaption { padding: 8px 12px; font-size: 11px; color: #333; background: #f2f2f2; text-transform: none; letter-spacing: 0; }"; document.head.appendChild(s); })();

(function () { var s = document.createElement("style"); s.textContent = ".sections .cardGrid { grid-template-columns: repeat(auto-fit, minmax(560px, 1fr)); } .sections > .pdfFig { max-width: 1100px; margin: 10px; }"; document.head.appendChild(s); })();
