/* eslint @typescript-eslint/no-var-requires: "off" */

require('dotenv').config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
