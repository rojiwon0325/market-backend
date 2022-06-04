import { RefundStatus } from 'src/refunds/entities/refund-status';
export enum OrderStatus {
  Pending = 'Pending',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
}

export const MergedStatus = { ...OrderStatus, ...RefundStatus };

export type MergedStatus = OrderStatus | RefundStatus;
