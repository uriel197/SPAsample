import { app } from "./Menu.js";

const Router = {
  init: () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a.navlink");
      if (link) {
        event.preventDefault();
        const href = link.getAttribute("href");
        Router.go(href);
      }
    });
    window.addEventListener("popstate", (event) => {
      Router.go(event.state?.route || location.pathname, false);
    });
    Router.go(location.pathname);
  },

  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    const bodyClasses = {
      "/index.html": "home",
      "/": "home",
      "/destination": "destination",
      "/crew": "crew",
      "/technology": "technology",
    };
    const body = document.querySelector("body");
    Object.values(bodyClasses).forEach((cls) => body.classList.remove(cls));
    const bodyClass = route.startsWith("/destination")
      ? "destination"
      : route.startsWith("/crew")
      ? "crew"
      : route.startsWith("/technology")
      ? "technology"
      : bodyClasses[route] || "";
    if (bodyClass) {
      body.classList.add(bodyClass);
    }
    let pageElement = null;
    const main = document.querySelector("#main");
    const currentPage = main.firstElementChild;
    //main.innerHTML = "";
    switch (route) {
      case "/":
      case "/index.html":
        pageElement = document.createElement("home-page");
        break;
      case "/destination":
        pageElement = document.createElement("destination-page");
        app.state.selected = location.hash.replace("#/", "") || "moon";
        break;
      case "/crew":
        pageElement = document.createElement("crew-page");
        app.state.selected =
          location.hash.replace("#/", "") || "douglas-hurley";
        break;
      case "/technology":
        pageElement = document.createElement("technology-page");
        app.state.selected =
          location.hash.replace("#/", "") || "launch-vehicle";
        break;
      default:
        pageElement = document.createElement("div");
        pageElement.textContent = "404 Not Found";
    }
    if (pageElement) {
      main.innerHTML = "";
      //main.appendChild(pageElement);
      const wrapper = document.createElement("div");
      //wrapper.style.opacity = "0";
      wrapper.appendChild(pageElement);
      if (currentPage) {
        const fadeOut = currentPage.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 200,
        });
        fadeOut.onfinish = () => {
          main.innerHTML = "";
          main.appendChild(wrapper);
          wrapper.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
          });
        };
      } else {
        main.appendChild(wrapper);
        wrapper.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 200,
        });
      }
      document.querySelectorAll(".primary-navigation li").forEach((li) => {
        li.classList.remove("active");
        const link = li.querySelector("a");
        if (
          link.getAttribute("href") === route ||
          (route.startsWith(link.getAttribute("href")) &&
            link.getAttribute("href") !== "/")
        ) {
          li.classList.add("active");
        }
        li.addEventListener("click", (e) => {
          const ul = e.target.closest("[data-visible]");
          const hamburger = document.querySelector(".mobile-nav-toggle");
          ul.dataset.visible === "true" ? (ul.dataset.visible = "false") : null;
          hamburger.ariaExpanded = false;
        });
      });
    }
    window.scrollTo(0, 0);
  },
};

export default Router;
