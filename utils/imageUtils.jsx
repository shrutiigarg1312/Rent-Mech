import images from "../constants/images";

export const getCategoryImage = (category) => {
  category = category.toLowerCase().replace(/\s+/g, "-");
  const key = category;
  if (images[category] && images[category][key]) {
    return images[category][key];
  }
  return null;
};

export const getEquipmentsImage = (category, model, company) => {
  category = category.toLowerCase().replace(/\s+/g, "-");
  model = model.toLowerCase().replace(/\s+/g, "-");
  company = company.toLowerCase().replace(/\s+/g, "-");

  const key = `${category}-${model}-${company}`;
  if (images[category] && images[category][key]) {
    return images[category][key];
  }
  return null;
};
