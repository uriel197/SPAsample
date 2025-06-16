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
    //main.innerHTML = "";
    switch (route) {
      case "/":
      case "/index.html":
        pageElement = document.createElement("home-page");
        break;
      case "/destination":
        pageElement = document.createElement("destination-page");
        // pageElement.dataset.selected = defaultHash || "moon";
        pageElement.dataset.selected =
          location.hash.replace("#/", "") || "moon";
        break;
      case "/crew":
        pageElement = document.createElement("crew-page");
        // pageElement.dataset.selected = defaultHash || "douglas-hurley";
        pageElement.dataset.selected =
          location.hash.replace("#/", "") || "douglas-hurley";
        break;
      case "/technology":
        pageElement = document.createElement("technology-page");
        // pageElement.dataset.selected = defaultHash || "launch-vehicle";
        pageElement.dataset.selected =
          location.hash.replace("#/", "") || "launch-vehicle";
        break;
      default:
        pageElement = document.createElement("div");
        pageElement.textContent = "404 Not Found";
    }
    if (pageElement) {
      main.innerHTML = "";
      main.appendChild(pageElement);
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
      });
    }
    window.scrollTo(0, 0);
  },
};

export default Router;
