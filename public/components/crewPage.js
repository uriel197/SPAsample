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
    }
    this.crew =
      app.state.menu.find((cat) => cat.name === "crew")?.content || [];
    window.addEventListener("hashchange", this.handleHashChange.bind(this));
    // Initial render
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this));
  }

  handleHashChange() {
    const hash = location.hash.replace("#/", "").toLowerCase();

    if (this.crew.some((member) => member.name.toLowerCase() === hash)) {
      this.dataset.selected = hash;
      this.render();
    }
  }

  render() {
    const selected = this.dataset.selected || "douglas-hurley";

    this.innerHTML = `
      <div class="grid-container grid-container--crew flow">
          <h1 class="numbered-title">
            <span aria-hidden="true">02</span> Meet your crew
          </h1>
        ${this.crew
          .map(
            (tech) => `
              <picture id="${tech.role.toLowerCase().replace(" ", "")}-image" ${
              tech.name.toLowerCase() !== selected ? "hidden" : ""
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
              (tech) => `
                <button name=${tech.name.toLowerCase()} class="fs-500" aria-selected="${
                tech.name.toLowerCase() === selected
              }" aria-controls="${tech.role
                .toLowerCase()
                .replace(" ", "")}-tab" role="tab" tabindex="${
                tech.name.toLowerCase() === selected ? 0 : -1
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
                .replace(" ", "")}-tab" ${
              tech.name.toLowerCase() !== selected ? "hidden" : ""
            }>
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
