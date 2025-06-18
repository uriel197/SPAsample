import { app } from "../services/Menu.js";

export function changeTabPanel(e) {
  const targetTab = e.target.closest("button[role='tab']");
  if (!targetTab) {
    console.error("No target tab found for changeTabPanel.");
    return;
  }
  const name = targetTab.getAttribute("name").toLowerCase();
  if (app.state.selected !== name) {
    app.setState({ selected: name });
    window.location.hash = `#/${name}`;
    this.updateContent(); // Trigger updateContent
  }
}

export function changeTabFocus(e) {
  const tabList = this.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll('[role="tab"]');
  let index = Array.from(tabs).findIndex(
    (tab) => tab === document.activeElement
  );
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    tabs[index].setAttribute("tabindex", -1);
    if (e.key === "ArrowRight") {
      index = index + 1 < tabs.length ? index + 1 : 0;
    } else {
      index = index - 1 >= 0 ? index - 1 : tabs.length - 1;
    }
    tabs[index].setAttribute("tabindex", "0");
    tabs[index].focus();
  }
}
