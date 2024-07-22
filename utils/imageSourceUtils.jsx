export const getImageSource = (category, model, company) => {
  category = category.toLowerCase();
  model = model.toLowerCase();
  company = company.toLowerCase();

  category = category.replace(/\s+/g, "-");
  model = model.replace(/\s+/g, "-");
  company = company.replace(/\s+/g, "-");

  try {
    const path = `../assets/images/${category}/${category}-${model}-${company}.jpg`;
    return path;
  } catch (error) {
    console.error("Image not found", error);
    return null;
  }
};
