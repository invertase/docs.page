import Router from "next/router";
import NProgress from "nprogress";

let timer: Timer;
let state: string;
const delay = 250;

NProgress.configure({ showSpinner: false });

function load() {
  if (state === "loading") {
    return;
  }

  state = "loading";

  timer = setTimeout(() => {
    NProgress.start();
  }, delay); // only show progress bar if it takes longer than the delay
}

function stop() {
  state = "stop";
  clearTimeout(timer);
  NProgress.done();
}

Router.events.on("routeChangeStart", load);
Router.events.on("routeChangeComplete", stop);
Router.events.on("routeChangeError", stop);

export default function () {
  return null;
}
