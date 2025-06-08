// services/Menu.js
import API from "./API.js";

export const app = {
  state: {
    menu: null, // Stores data.json content
    selected: null, // Tracks selected item (e.g., "moon" for destination)
  },
  setState(newState) {
    this.state = { ...this.state, ...newState };
    document.dispatchEvent(new CustomEvent("statechange"));
  },
};

export async function loadData() {
  try {
    const data = await API.fetchMenu();
    app.setState({ menu: data });
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

export async function getItemById(id) {
  if (!app.state.menu) {
    await loadData();
  }
  for (let category of app.state.menu) {
    for (let item of category.content) {
      if (item.id === Number(id)) {
        return item;
      }
    }
  }
  return null;
}
