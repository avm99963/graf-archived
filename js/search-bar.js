// *********** HERE STARTS search-bar.js *************

function altSearchBar() {
	if (document.querySelector(".md-google-search__metacontainer").style.display == "none") {
		document.querySelector(".md-google-search__metacontainer").style.display = "block";
		document.querySelector("#search i").innerText = "fullscreen";
		document.querySelector("#search-input").focus();
	} else {
		document.querySelector(".md-google-search__metacontainer").style.display = "none";
		document.querySelector(".autocomplete-container").style.display = "none";
		document.querySelector("#search i").innerText = "search";
	}
}

function initSearchBar() {
	document.querySelector("#search").addEventListener("click", altSearchBar);
	if (window.innerWidth > 700) altSearchBar();
}
