import { eventApi as eventAxios } from './axiosInstances';

export const createBudget     = (data)               => eventAxios.post('/budgets', data);
export const getBudgetByEvent = (eventId)             => eventAxios.get(`/budgets/event/${eventId}`);
export const addExpense       = (budgetId, data)      => eventAxios.post(`/budgets/${budgetId}/expenses`, data);
export const deleteExpense    = (budgetId, expenseId) => eventAxios.delete(`/budgets/${budgetId}/expenses/${expenseId}`);