import { app, loadData } from "../services/Menu.js";
import { changeTabPanel, changeTabFocus } from "../utility-functions/index.js";

class DestinationPage extends HTMLElement {
  constructor() {
    super();
    this.destinations = [];
  }

  async connectedCallback() {
    if (!app.state.menu) {
      await loadData();
    }

    this.destinations =
      app.state.menu.find((cat) => cat.name === "destinations")?.content || [];
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
                  <button 
                    class="uppercase ff-sans-cond text-accent letter-spacing-2"
                    name=${dest.name.toLowerCase()} 
                    aria-selected="${dest.name.toLowerCase() === selected}" 
                    role="tab" 
                    aria-controls="${dest.name.toLowerCase()}-tab"
                    tabindex="${dest.name.toLowerCase() === selected ? 0 : -1}"
                    data-image="${dest.name.toLowerCase()}-image">
                    ${dest.name}
                  </button>
                `
              )
              .join("")}
          </div>
          ${this.destinations
            .map(
              (dest) => `
                <article class="destination-info flow" 
                    id="${dest.name.toLowerCase()}-tab"
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
  }
}

customElements.define("destination-page", DestinationPage);
