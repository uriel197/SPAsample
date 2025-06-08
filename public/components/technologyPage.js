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
    const selectedName =
      this.dataset.selected?.toLowerCase().replace(" ", "") ||
      this.technologies[0]?.name.toLowerCase().replace(" ", "");
    app.setState({ selected: selectedName });

    document.addEventListener("statechange", () => this.render());
    this.render();
  }

  render() {
    const selected =
      app.state.selected?.toLowerCase().replace(" ", "") ||
      this.technologies[0]?.name.toLowerCase().replace(" ", "");
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
                  <img src="${tech.images.landscape}" alt="${tech.name}">
                </picture>
              `
            )
            .join("")}
          <div class="numbered-indicators grid-column" role="tablist">
            ${this.technologies
              .map(
                (tech, index) => `
                  <button class="fs-500" aria-selected="${
                    tech.name.toLowerCase().replace(" ", "") === selected
                  }"
                    aria-controls="${tech.name
                      .toLowerCase()
                      .replace(" ", "")}-tab" role="tab"
                    tabindex="${
                      tech.name.toLowerCase().replace(" ", "") === selected
                        ? 0
                        : -1
                    }"
                    data-image="${tech.name
                      .toLowerCase()
                      .replace(" ", "")}-image">${index + 1}
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
                  id="${tech.name.toLowerCase().replace(" ", "")}-tab"
                  ${
                    tech.name.toLowerCase().replace(" ", "") !== selected
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
