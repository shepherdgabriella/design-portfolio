fetch("projects-data.json").then(response => response.json()).then(data => {
	let i = 0;
    for (entry of data) {
		const projectCard = document.createElement("a");
		projectCard.className = "project-card";

		projectCard.href = "project.html?id=" + i;

		const img = document.createElement("img");
		img.src = "projects/imgs/" + entry.thumbnail;
		img.alt = entry.title;
		projectCard.appendChild(img);

		const overlay = document.createElement("div");
		overlay.className = "project-card-overlay";

		const overlayText = document.createElement("div");
		overlayText.className = "project-card-overlay-text";
		overlayText.textContent = entry.title;
		overlay.appendChild(overlayText);

		projectCard.appendChild(overlay);

		document.getElementById("projectsGallery").appendChild(projectCard);
		i++;
	}
});
(function(){fetch("projects-data.json").then(function(r){return r.json()}).then(function(d){d.forEach(function(e,i){if(!e.thumbCrop)return;var a=e.thumbCrop.split(",").map(Number),C="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/",s=document.createElement("script");s.src=C+"pdf.min.js";s.onload=function(){pdfjsLib.GlobalWorkerOptions.workerSrc=C+"pdf.worker.min.js";pdfjsLib.getDocument(encodeURI("projects/imgs/Powertrain PDR 26-27.pdf")).promise.then(function(doc){return doc.getPage(a[0])}).then(function(pg){var v=pg.getViewport({scale:1}),bw=a[3]-a[1],bh=a[4]-a[2],vp=pg.getViewport({scale:1200/(v.width*bw)}),cv=document.createElement("canvas");cv.width=Math.round(vp.width*bw);cv.height=Math.round(vp.height*bh);return pg.render({canvasContext:cv.getContext("2d"),viewport:vp,transform:[1,0,0,1,-vp.width*a[1],-vp.height*a[2]]}).promise.then(function(){var t=0,iv=setInterval(function(){var im=document.querySelectorAll(".project-card img")[i];t++;if(im){clearInterval(iv);im.src=cv.toDataURL("image/png")}else if(t>50)clearInterval(iv)},100)})}).catch(function(){})};document.head.appendChild(s)})})})();
