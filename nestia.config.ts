import { IConfiguration } from 'nestia/lib/IConfiguration';

const NESTIA_CONFIG: IConfiguration = {
  input: {
    include: [
      './src/app.controller.ts',
      './src/auth/auth.controller.ts',
      './src/users/users.controller.ts',
    ],
  },
  output: './src/sdk',
  swagger: {
    output: './dist/swagger.json',
  },
};
export default NESTIA_CONFIG;
