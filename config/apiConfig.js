export const API_BASE_URL = "https://rentmech.onrender.com";
export const API_MAIL_URL = "https://rmmail.onrender.com";

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/adduser`,
  AUTHENTICATE: `${API_BASE_URL}/authenticate`,
  VALIDATE_USER: `${API_BASE_URL}/check-email`,
  GET_USER: `${API_BASE_URL}/getUser`,
  UPDATE_PASSWORD: `${API_BASE_URL}/update`,
  SEND_EMAIL: `${API_MAIL_URL}/send-email`,
  GET_EQUIPMENTS: `${API_BASE_URL}/getEquipments`,
  ADD_EQUIPMENT: `${API_BASE_URL}/addEquipment`,
  GET_ORDERS: `${API_BASE_URL}/getOrders`,
  GET_ORDERS_BY_STATUS: `${API_BASE_URL}/getOrdersByStatus`,
  MAKE_ORDER: `${API_BASE_URL}/makeOrder`,
  GET_USER_ADDRESSES: `${API_BASE_URL}/getUserAddresses`,
  ADD_USER_ADDRESS: `${API_BASE_URL}/addAddress`,
  ADD_EQUIPMENT_DETAIL: `${API_BASE_URL}/addEquipmentsDetail`,
  ADD_VENDOR: `${API_BASE_URL}/addVendor`,
  GET_VENDORS_LIST: `${API_BASE_URL}/getVendorsList`,
  ACCEPT_ORDER: `${API_BASE_URL}/acceptOrder`,
  CANCEL_ORDER: `${API_BASE_URL}/cancelOrder`,
  COMPLETE_ORDER: `${API_BASE_URL}/completeOrder`,
};

export const API_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
};
