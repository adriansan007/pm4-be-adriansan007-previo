import { Product } from './product.interface';

const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: 'Notebook',
    description: 'Laptop 15 pulgadas',
    price: 1000,
    stock: 2,
    imgUrl: 'https://example.com/notebook.jpg',
  },
  {
    id: 2,
    name: 'Mouse',
    description: 'Mouse óptico inalámbrico',
    price: 20,
    stock: 5,
    imgUrl: 'https://example.com/mouse.jpg',
  },
  {
    id: 3,
    name: 'Monitor',
    description: 'Monitor Full HD 24 pulgadas',
    price: 200,
    stock: 0,
    imgUrl: 'https://example.com/monitor.jpg',
  },
];

export const productsProviders = [
  {
    provide: 'PRODUCTS_DATA',
    useValue: PRODUCTS_DATA,
  },
];
