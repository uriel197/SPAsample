import Router from "./services/Router.js";
import "./components/homePage.js"; // Add this line
import "./components/destinationPage.js";
import "./components/crewPage.js";
import "./components/technologyPage.js";

const nav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");
const skipLink = document.querySelector(".skip-to-content");

navToggle.addEventListener("click", () => {
  const visibility = nav.getAttribute("data-visible");
  nav.setAttribute("data-visible", visibility === "false" ? "true" : "false");
  navToggle.setAttribute(
    "aria-expanded",
    visibility === "false" ? "true" : "false"
  );
});

// Handle skip link click
skipLink.addEventListener("click", (event) => {
  event.preventDefault();
  const main = document.querySelector("#main");
  if (main) {
    main.focus();
    // Ensure main is scrolled into view
    main.scrollIntoView({ behavior: "smooth" });
  }
});

Router.init();
