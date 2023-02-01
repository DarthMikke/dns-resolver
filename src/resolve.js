"use strict";

const matchPatterns = [
  {
    match: ".web.headspin.no$",
    target: "192.168.15.10",
    forceProtocol: "",
  },
  {
    match: "dns.test$",
    target: "localhost:8000",
    forceProtocol: "http",
  },
  {
    match: "dev.millim.no$",
    target: "localhost:3000",
    forceProtocol: "",
  },
];

let headers = {}

console.log("Heisann");

function listener(requestDetails) {
  console.debug(requestDetails);
  let url = new URL(requestDetails.url);
  const originalHost = url.host;
  matchPatterns.forEach(x => {
    if (!url.host.match(x.match)) {
      return;
    }
    url.host = x.target;
    if (x.forceProtocol) {
      url.protocol = x.forceProtocol;
    }
  });
  if (url.host == originalHost) {
    return;
  }

  headers[requestDetails.requestId] = [
    {
      "name": "Host",
      "value": originalHost,
    },
    {
      "name": "X-Original-Host",
      "value": originalHost,
    }
  ];

  console.log(`Redirecting ${originalHost} to ${url.toString()}`);
  return {
    redirectUrl: url.toString(),
  }
}

function headersListener(requestDetails) {
  console.debug(requestDetails);
  console.debug(headers[requestDetails.requestId]);
  if (headers[requestDetails.requestId]) {
    return {
      requestHeaders: headers[requestDetails.requestId],
    };
  }
  return;
}


const filters = {
  urls: ["*://*/*"],
  // types: ["main_frame"],
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  filters,
  ["blocking"]  // extraInfoSpec
);

browser.webRequest.onBeforeSendHeaders.addListener(
  headersListener,
  filters,
  ["requestHeaders", "blocking"]
);

