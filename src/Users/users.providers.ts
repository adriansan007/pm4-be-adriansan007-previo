import { User } from './user.interface';

export const usersProviders = [
  {
    provide: 'USERS_DATA',
    useValue: <User[]>[
      {
        id: 1,
        email: 'adrian@correo.com',
        name: 'Adrián',
        password: '1234',
        address: 'Calle 1',
        phone: '111-111',
        country: 'Argentina',
        city: 'Buenos Aires',
      },
      {
        id: 2,
        email: 'maria@correo.com',
        name: 'María',
        password: '5678',
        address: 'Calle 2',
        phone: '222-222',
        country: 'Argentina',
        city: 'Córdoba',
      },
    ],
  },
];
