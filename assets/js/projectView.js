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
