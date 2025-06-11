import { app, loadData } from "../services/Menu.js";
import { changeTabPanel, changeTabFocus } from "../utility-functions/index.js";

class DestinationPage extends HTMLElement {
  constructor() {
    super();
    this.destinations = [];
  }

  async connectedCallback() {
    // Load data if not already loaded
    if (!app.state.menu) {
      await loadData();
      console.log(app.state.menu);
    }
    this.destinations =
      app.state.menu.find((cat) => cat.name === "destinations")?.content || [];
    window.addEventListener("hashchange", this.handleHashChange.bind(this));

    // Initial render
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this));
  }

  handleHashChange() {
    const hash = location.hash.replace("#/", "").toLowerCase();
    if (this.destinations.some((dest) => dest.name.toLowerCase() === hash)) {
      this.dataset.selected = hash;
      this.render();
    }
  }

  render() {
    const selected = this.dataset.selected || "moon";
    this.innerHTML = `
        <div class="grid-container grid-container--destination flow">
          <h1 class="numbered-title"><span aria-hidden="true">01</span> Pick your destination</h1>
          ${this.destinations
            .map(
              (dest) => `
                <picture id="${dest.name.toLowerCase()}-image" ${
                dest.name.toLowerCase() !== selected ? "hidden" : ""
              }>
                  <source srcset="${dest.images.webp}" type="image/webp">
                  <img src="${dest.images.png}" alt="${dest.name}">
                </picture>
              `
            )
            .join("")}
          <div class="tab-list underline-indicators flex" role="tablist" aria-label="destination list">
            ${this.destinations
              .map(
                (dest) => `
                  <button name=${dest.name.toLowerCase()} aria-selected="${
                  dest.name.toLowerCase() === selected
                }" role="tab" aria-controls="${dest.name.toLowerCase()}-tab"
                    class="uppercase ff-sans-cond text-accent letter-spacing-2"
                    tabindex="${dest.name.toLowerCase() === selected ? 0 : -1}"
                    data-image="${dest.name.toLowerCase()}-image">${
                  dest.name
                }</button>
                `
              )
              .join("")}
          </div>
          ${this.destinations
            .map(
              (dest) => `
                <article class="destination-info flow" id="${dest.name.toLowerCase()}-tab"
                  role="tabpanel" ${
                    dest.name.toLowerCase() !== selected ? "hidden" : ""
                  }>
                  <h2 class="fs-800 uppercase ff-serif">${dest.name}</h2>
                  <p>${dest.description}</p>
                  <div class="destination-meta flex">
                    <div>
                      <h3 class="text-accent fs-200 uppercase">Avg. distance</h3>
                      <p class="fs-500 ff-serif uppercase">${dest.distance}</p>
                    </div>
                    <div>
                      <h3 class="text-accent fs-200 uppercase">Est. travel time</h3>
                      <p class="fs-500 ff-serif uppercase">${dest.travel}</p>
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      `;

    // Add tab event listeners
    this.querySelector('[role="tablist"]').addEventListener(
      "keydown",
      changeTabFocus.bind(this)
    );
    this.querySelectorAll('[role="tab"]').forEach((tab) =>
      tab.addEventListener("click", changeTabPanel.bind(this))
    );
  }
}

customElements.define("destination-page", DestinationPage);
