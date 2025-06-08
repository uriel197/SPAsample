const Router = {
  init: () => {
    document.querySelectorAll("a.navlink").forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const href = a.getAttribute("href");
        console.log("Navlink clicked:", href);
        Router.go(href);
      });
    });

    window.addEventListener("popstate", (event) => {
      Router.go(event.state?.route || "/", false);
    });

    // Handle initial URL
    const initialPath = location.pathname;
    // JavaScript allows access to certain window properties (like location, document, alert, etc.) directly without prefixing window., as they are implicitly available in the global scope.

    Router.go(initialPath);
  },

  go: (route, addToHistory = true) => {
    // Strip hash from route to prevent interference
    const cleanRoute = route.split("#")[0] || "/";
    if (addToHistory) {
      history.pushState({ route: cleanRoute }, "", cleanRoute);
    }

    // Define page-specific body classes
    const bodyClasses = {
      "/index.html": "home",
      "/": "home",
      "/destination": "destination",
      "/crew": "crew",
      "/technology": "technology",
    };

    // Clear all page-specific body classes
    const body = document.querySelector("body");
    Object.values(bodyClasses).forEach((cls) => body.classList.remove(cls));

    // Add the class for the current route
    const bodyClass = route.startsWith("/destination")
      ? "destination"
      : route.startsWith("/crew")
      ? "crew"
      : route.startsWith("/technology")
      ? "technology"
      : bodyClasses[cleanRoute] || "";
    if (bodyClass) {
      body.classList.add(bodyClass);
    }

    let pageElement = null;
    const main = document.querySelector("#main");

    // Clear existing content
    main.innerHTML = "";

    if (cleanRoute.startsWith("/destination")) {
      pageElement = document.createElement("destination-page");
      const itemName = route.split("/")[2]; // e.g., "moon"
      pageElement.dataset.selected = itemName;
    } else if (cleanRoute.startsWith("/crew/")) {
      pageElement = document.createElement("crew-page");
      pageElement.dataset.selected = route.split("/")[2];
    } else if (cleanRoute.startsWith("/technology/")) {
      pageElement = document.createElement("technology-page");
      pageElement.dataset.selected = route.split("/")[2];
    } else {
      switch (cleanRoute) {
        case "/":
        case "/index.html":
          pageElement = document.createElement("home-page");
          break;
        case "/destination":
          pageElement = document.createElement("destination-page");
          break;
        case "/crew":
          pageElement = document.createElement("crew-page");
          break;
        case "/technology":
          pageElement = document.createElement("technology-page");
          break;
        default:
          pageElement = document.createElement("div");
          pageElement.textContent = "404 Not Found";
      }
    }

    if (pageElement) {
      const currentPage = main.firstElementChild;
      if (currentPage) {
        const fadeOut = currentPage.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 300,
        });
        fadeOut.onfinish = () => {
          main.innerHTML = "";
          main.appendChild(pageElement);
          pageElement.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 300,
          });
        };
      } else {
        main.appendChild(pageElement);
      }

      // Update active navigation
      document.querySelectorAll(".primary-navigation li").forEach((li) => {
        li.classList.remove("active");
        const link = li.querySelector("a");
        if (
          link.getAttribute("href") === cleanRoute ||
          (cleanRoute.startsWith(link.getAttribute("href") + "/") &&
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
