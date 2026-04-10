export class CreateCementOrderDto {
  customerName: string;
  customerEmail: string;
  userId: string;
  customerPhone: string;
  address: string;
  deliveryInstruction?: string;
  items: {
    brand: string;
    productId: string;
    city: string;
    weightKg: number;
    price: number;
    quantity: number;
    image?: string;
  }[];
  subTotal: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: string;
}
