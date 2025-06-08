// Reuse tabs.js logic
export function changeTabFocus(e) {
  const rightArrow = 39;
  const leftArrow = 37;
  const tabs = this.querySelectorAll('[role="tab"]');
  let tabFocus = Array.from(tabs).findIndex(
    (tab) => tab.getAttribute("tabindex") === "0"
  );

  if (e.keyCode === rightArrow || e.keyCode === leftArrow) {
    tabs[tabFocus].setAttribute("tabindex", -1);
  }
  if (e.keyCode === rightArrow) {
    tabFocus = tabFocus < tabs.length - 1 ? tabFocus + 1 : 0;
  }
  if (e.keyCode === leftArrow) {
    tabFocus = tabFocus > 0 ? tabFocus - 1 : tabs.length - 1;
  }
  tabs[tabFocus].setAttribute("tabindex", 0);
  tabs[tabFocus].focus();
}

export function changeTabPanel(e) {
  const targetTab = e.target;
  const dataImage = targetTab.getAttribute("data-image");
  const targetPanel = targetTab.getAttribute("aria-controls");

  this.querySelector('[aria-selected="true"]').setAttribute(
    "aria-selected",
    false
  );
  targetTab.setAttribute("aria-selected", true);

  this.querySelectorAll("picture").forEach((pic) =>
    pic.setAttribute("hidden", true)
  );
  this.querySelector(`#${dataImage}`).removeAttribute("hidden");

  this.querySelectorAll('[role="tabpanel"]').forEach((panel) =>
    panel.setAttribute("hidden", true)
  );
  this.querySelector(`#${targetPanel}`).removeAttribute("hidden");
}
