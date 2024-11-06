import { Provider } from './Provider';

export type Article = {
  id: number | undefined;
  label: string;
  price: string;
  picture: string;
  provider: Provider;
};
