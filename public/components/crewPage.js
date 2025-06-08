import { app, loadData } from "../services/Menu.js";
import { changeTabFocus, changeTabPanel } from "../utility-functions/index.js";

class CrewPage extends HTMLElement {
  constructor() {
    super();
    this.crew = [];
  }

  async connectedCallback() {
    if (!app.state.menu) {
      await loadData();
      console.log(app.state.menu);
    }
    this.crew =
      app.state.menu.find((cat) => cat.name === "crew")?.content || [];
    console.log(this.crew);

    // Set initial selected item from dataset or default to first
    const selectedName =
      //   this.dataset.selected?.toLowerCase() ||
      this.crew[0]?.name.toLowerCase();
    console.log(selectedName);

    app.setState({ selected: selectedName });

    // Listen for state changes
    document.addEventListener("statechange", () => this.render());

    // Initial render
    this.render();
  }

  render() {
    const selected =
      app.state.selected?.toLowerCase() || this.crew[0]?.name.toLowerCase();
    this.innerHTML = `
      <div class="grid-container grid-container--crew flow">
          <h1 class="numbered-title">
            <span aria-hidden="true">02</span> Meet your crew
          </h1>
        ${this.crew
          .map(
            (tech, index) => `
              <picture id="${tech.role.toLowerCase().replace(" ", "")}-image" ${
              index !== 0 ? "hidden" : ""
            }>
                <source srcset="${tech.images.webp}" media="(min-width: 55em)">
                <img src="${tech.images.png}" alt="${tech.role}">
              </picture>
            `
          )
          .join("")}
        <div class="dot-indicators flex" role="tablist">
          ${this.crew
            .map(
              (tech, index) => `
                <button class="fs-500" aria-selected="${
                  index === 0
                }" aria-controls="${tech.role
                .toLowerCase()
                .replace(" ", "")}-tab" role="tab" tabindex="${
                index === 0 ? 0 : -1
              }"
                  data-image="${tech.role
                    .toLowerCase()
                    .replace(" ", "")}-image">
                  <span class="sr-only">${tech.role}</span>
                </button>
              `
            )
            .join("")}
        </div>
        ${this.crew
          .map(
            (tech, index) => `
              <article class="crew-details flow" role="tabpanel" id="${tech.role
                .toLowerCase()
                .replace(" ", "")}-tab" ${index !== 0 ? "hidden" : ""}>
                <header class="flow flow--space-small">
                  <h2 class="fs-600 ff-serif uppercase">The terminology...</h2>
                  <p class="fs-700 uppercase ff-serif">${tech.name}</p>
                </header>
                <p class="text-accent max-width">${tech.bio}</p>
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

customElements.define("crew-page", CrewPage);
