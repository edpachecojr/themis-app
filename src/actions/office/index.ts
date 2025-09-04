// Actions básicas de office
export { addOffice } from "./add";
export { getOfficeById } from "./get";
export { getOffices, getAllOffices } from "./get-all";
export { updateOffice } from "./update";
export { deleteOffice } from "./delete";

// Actions especializadas
export { getOfficesByType } from "./get-by-type";
export { getOfficeStats } from "./get-stats";
export { getOfficesWithAdvancedFilters } from "./get-with-advanced-filters";
