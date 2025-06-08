const API = {
  url: "assets/data.json",
  fetchMenu: async () => {
    const result = await fetch(API.url);
    return await result.json();
  },
};

export default API;
