export const loader = async () => {
  const response = await fetch("https://staging-api.docs.page/schema.json");
  return response.json();
};
