export const productData = [
  {
    id: 'c520361a-8e76-4564-b0eb-737246fd922b',
    name: 'puma',
    price: 7500,
    isDeleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'aa50e9ae-246b-4955-8fa9-17218a5db945',
    name: 'adidas',
    price: 2500,
    isDeleted: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '25201831-dd75-4963-8478-26866cf3db7f',
    name: 'nike',
    price: 500,
    isDeleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

interface productInterface {
  id: string;
  name: string;
  price: number;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
}
