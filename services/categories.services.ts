import { finsCategoriesList } from '../repository/categories.repository.js';

export const getCategories = async () => await finsCategoriesList();
