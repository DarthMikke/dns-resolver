"use strict";

console.log("Heisann");
console.log(browser.webRequest);

function listener(requestDetails) {
  const matchPattern = "web.headspin.no$";
  let url = new URL(requestDetails.url);
  console.log(`Loading ${url}`);
  if (!url.host.match(matchPattern)) {
    return;
  }
  url.host = "localhost:8000";
  url.protocol = "http";
  console.log(`Redirecting to ${url.toString()}`);
  return {
    redirectUrl: url.toString(),
  }
}

const filters = {
  urls: ["*://*/*"],
  // types: ["main_frame"],
}
const extraInfoSpec = ["blocking"]

browser.webRequest.onBeforeRequest.addListener(
  listener,
  filters,
  extraInfoSpec
);
