import { api } from "@/lib/api";

export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
) => {
  const params: any = { page, limit };
  if (status && status !== "all") params.status = status;
  const response = await api.get("/orders", { params });
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  status: "paid" | "cancelled",
) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
