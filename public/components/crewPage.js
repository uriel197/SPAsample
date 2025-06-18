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
    console.log(selected);

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
      <div class="grid-container grid-container--crew flow">
          <h1 class="numbered-title">
            <span aria-hidden="true">02</span> Meet your crew
          </h1>
        ${this.crew
          .map(
            (member) => `
              <picture id="${member.role
                .toLowerCase()
                .replace(" ", "")}-image" ${
              member.name.toLowerCase().replace(" ", "-") !== selected
                ? "hidden"
                : ""
            }>
                <source srcset="${
                  member.images.webp
                }" media="(min-width: 45em)">
                <img src="${member.images.png}" alt="${member.role}">
              </picture>
            `
          )
          .join("")}
        <div class="dot-indicators flex" role="tablist">
          ${this.crew
            .map(
              (member) => `
                <button name=${member.name
                  .toLowerCase()
                  .replace(" ", "-")} class="fs-500" aria-selected="${
                member.name.toLowerCase().replace(" ", "-") === selected
              }" aria-controls="${member.role
                .toLowerCase()
                .replace(" ", "")}-tab" role="tab" tabindex="${
                member.name.toLowerCase().replace(" ", "-") === selected
                  ? 0
                  : -1
              }"
                  data-image="${member.role
                    .toLowerCase()
                    .replace(" ", "")}-image">
                  <span class="sr-only">${member.role}</span>
                </button>
              `
            )
            .join("")}
        </div>
        ${this.crew
          .map(
            (member) => `
              <article class="crew-details flow" role="tabpanel" id="${member.role
                .toLowerCase()
                .replace(" ", "")}-tab" ${
              member.name.toLowerCase().replace(" ", "-") !== selected
                ? "hidden"
                : ""
            }>
                <header class="flow flow--space-small">
                  <h2 class="fs-600 ff-serif uppercase">The terminology...</h2>
                  <p class="fs-700 uppercase ff-serif">${member.name}</p>
                </header>
                <p class="text-accent max-width">${member.bio}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }
}

customElements.define("crew-page", CrewPage);
