// services/Menu.js
import API from "./API.js";

export const app = {
  state: {
    menu: null, // Stores data.json content
    selected: null,
  },
  setState(newState) {
    this.state = { ...this.state, ...newState };
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
