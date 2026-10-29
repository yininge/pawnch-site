// OAuth relay: forward Threads' ?code/&state to the local review console (fixed target only).
(function () {
  var target = "http://localhost:8788/oauth/callback";
  var src = new URLSearchParams(location.search);
  var out = new URLSearchParams();
  ["code", "state", "error", "error_reason", "error_description"].forEach(function (k) {
    if (src.has(k)) out.set(k, src.get(k).split("#")[0]);
  });
  var url = target + (out.toString() ? "?" + out.toString() : "");
  document.getElementById("back").href = url;
  location.replace(url);
})();
