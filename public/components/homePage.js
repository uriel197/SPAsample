// components/HomePage.js
class HomePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Listen for state changes
    document.addEventListener("statechange", () => this.render());
    // Initial render
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="grid-container grid-container--home">
        <div class="max-width">
          <h1 class="text-accent fs-300 ff-sans-cond uppercase letter-spacing-1">
            So, you want to travel to
            <span class="d-block fs-900 ff-serif text-white">Space</span>
          </h1>
          <p class="text-accent fs-400">
            Space exploration demands commitment—don’t settle for near-orbit glimpses. Visit our site to access detailed resources on Mars, the Moon, and beyond. Engage with scientific data and mission insights for an immersive, evidence-based journey into the cosmos.
          </p>
        </div>
          <a class="navlink large-button uppercase ff-serif text-dark bg-white" href="/destination">Explore</a>
      </div>
    `;
  }
}

customElements.define("home-page", HomePage);
