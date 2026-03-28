export const AUTH = {
  LOGIN: "/api/auth/login",
  REGISTER_CITIZEN: "/api/auth/register-citizen",
  REGISTER_POLICE: "/api/auth/register-police"
};

export const COMPLAINT = {
  FILE: "/api/complaints",
  USER: (id) => `/api/complaints/user/${id}`
};

export const POLICE = {
  LIST: "/api/complaints/all",
  UPDATE: (id) => `/api/complaints/${id}`,
  FIR_FOLDER: "/api/police/fir"
};


export const EMERGENCY = {
  ALERT: "/api/emergency"
};
