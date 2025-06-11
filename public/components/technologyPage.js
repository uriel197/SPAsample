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
    window.addEventListener("hashchange", this.handleHashChange.bind(this));
    // Initial render
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this));
  }

  handleHashChange() {
    const hash = location.hash.replace("#/", "").toLowerCase();
    if (this.technologies.some((tech) => tech.name.toLowerCase() === hash)) {
      this.dataset.selected = hash;
      this.render();
    }
  }

  render() {
    const selected = this.dataset.selected || "launch-vehicle";

    this.innerHTML = `
        <div class="grid-container grid-container--technology">
          <h1 class="numbered-title"><span aria-hidden="true">03</span>Space launch 101</h1>
          ${this.technologies
            .map(
              (tech) => `
                <picture id="${tech.name.toLowerCase().replace(" ", "")}-image"
                  ${
                    tech.name.toLowerCase().replace(" ", "") !== selected
                      ? "hidden"
                      : ""
                  }>
                  <source srcset="${
                    tech.images.portrait
                  }" media="(min-width: 55em)">
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
                  <button name=${tech.name.toLowerCase()} class="fs-500" aria-selected="${
                  tech.name.toLowerCase() === selected
                }"
                    aria-controls="${tech.name.toLowerCase()}-tab" role="tab"
                    tabindex="${tech.name.toLowerCase() === selected ? 0 : -1}"
                    data-image="${tech.name.toLowerCase()}-image">${index + 1}
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
                  id="${tech.name.toLowerCase()}-tab"
                  ${tech.name.toLowerCase() !== selected ? "hidden" : ""}>
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
    this.querySelector('[role="tablist"]').addEventListener(
      "keydown",
      changeTabFocus.bind(this)
    );
    this.querySelectorAll('[role="tab"]').forEach((tab) =>
      tab.addEventListener("click", changeTabPanel.bind(this))
    );
  }
}

customElements.define("technology-page", TechnologyPage);
