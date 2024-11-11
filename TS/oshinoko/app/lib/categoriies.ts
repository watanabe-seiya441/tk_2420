export interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

export const categories: CategoryItem[] = [
  { id: 'aespa', name: 'Aespa', image: '/whisplash.png' },
  { id: 'nokizaka', name: 'Nokizaka', image: '/giselle4.jpg' },
  // Add more categories as needed
];
