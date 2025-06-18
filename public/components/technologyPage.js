import { app, loadData } from "../services/Menu.js";
import { changeTabPanel, changeTabFocus } from "../utility-functions/index.js";

class TechnologyPage extends HTMLElement {
  constructor() {
    super();
    this.technologies = [];
  }

  async connectedCallback() {
    if (!app.state.menu) {
      await loadData();
    }
    this.technologies =
      app.state.menu.find((cat) => cat.name === "technology")?.content || [];
    this.addEventListener("click", this.handleTabClick.bind(this));
    this.addEventListener("keydown", this.handleTabFocus.bind(this));
    this.render();
    if (!location.hash) {
      const locationHash = `#/${app.state.selected}`;
      window.location.hash = locationHash;
    }
  }

  handleTabClick(event) {
    const targetTab = event.target.closest("button[role='tab']");
    if (targetTab) {
      changeTabPanel.call(this, event);
    }
  }

  handleTabFocus(event) {
    const targetTab = event.target.closest("button[role='tab']");
    if (targetTab) {
      changeTabFocus.call(this, event);
    }
  }

  updateContent() {
    const selected = app.state.selected;

    this.querySelectorAll('[role="tab"]').forEach((tab) => {
      const isSelected = tab.getAttribute("name") === selected;
      tab.setAttribute("aria-selected", isSelected);
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
    });
    this.querySelectorAll("picture").forEach((pic) =>
      pic.setAttribute("hidden", true)
    );
    const image = this.querySelector(`#${selected}-image`);
    if (image) image.removeAttribute("hidden");
    this.querySelectorAll('[role="tabpanel"]').forEach((panel) =>
      panel.setAttribute("hidden", true)
    );
    const panel = this.querySelector(`#${selected}-tab`);
    if (panel) panel.removeAttribute("hidden");
  }

  render() {
    const selected = app.state.selected;

    this.innerHTML = `
        <div class="grid-container grid-container--technology">
          <h1 class="numbered-title"><span aria-hidden="true">03</span>Space launch 101</h1>
          ${this.technologies
            .map(
              (tech) => `
                <picture id="${tech.name.toLowerCase().replace(" ", "-")}-image"
                  ${
                    tech.name.toLowerCase().replace(" ", "-") !== selected
                      ? "hidden"
                      : ""
                  }>
                  <source srcset="${
                    tech.images.portrait
                  }" media="(min-width: 55rem)">
                  <img src="${tech.images.landscape}" alt="${
                tech.name
              }" type="image/webp">
                <source srcset="${tech.images.landscape}" type="image/webp">
                </picture>
              `
            )
            .join("")}
          <div class="numbered-indicators grid-column" role="tablist">
            ${this.technologies
              .map(
                (tech, index) => `
                  <button name=${tech.name
                    .toLowerCase()
                    .replace(" ", "-")} class="fs-500" aria-selected="${
                  tech.name.toLowerCase().replace(" ", "-") === selected
                }"
                    aria-controls="${tech.name
                      .toLowerCase()
                      .replace(" ", "-")}-tab" role="tab"
                    tabindex="${
                      tech.name.toLowerCase().replace(" ", "-") === selected
                        ? 0
                        : -1
                    }"
                    data-image="${tech.name
                      .toLowerCase()
                      .replace(" ", "-")}-image">${index + 1}
                    <span class="sr-only">${tech.name}</span>
                  </button>
                `
              )
              .join("")}
          </div>
          ${this.technologies
            .map(
              (tech) => `
                <article class="technology-details flow" role="tabpanel"
                  id="${tech.name.toLowerCase().replace(" ", "-")}-tab"
                  ${
                    tech.name.toLowerCase().replace(" ", "-") !== selected
                      ? "hidden"
                      : ""
                  }>
                  <header class="flow">
                    <h2 class="fs-400 ff-serif uppercase">The terminology...</h2>
                    <p class="fs-700 uppercase ff-serif">${tech.name}</p>
                  </header>
                  <p class="text-accent max-width">${tech.description}</p>
                </article>
              `
            )
            .join("")}
        </div>
      `;
  }
}

customElements.define("technology-page", TechnologyPage);
