import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) => SetMetadata(ROLES_KEY, roles);


// AUTHENTICATION AND AUTHORIZATION
// 1.Start at user module
// 2. bcrypt check user entity 
// 3. when using entity make sure you register it check user module.
// 4. Create auth module 
// nest g res auth --no spec // to not create a test file
// npm install --save @nestjs/passport passport passport-local
// npm install --save-dev @types/passport-local
// Using passport strategy:
// What are passport strategies ??
// Passport strategies are auth mechnisms thta defined how a user can prove identity to our application.
// check auth folder
// when using smth like a repo or a module in another modukle ensure to reguister it

// CREATING CUSTOM GUARDS
// nest g gu auth/guards/local-auth
// localauth guard invokes localstrategy.

// USING JWT TOKENS
// npm i @nestjs/jwt passport-jwt
// npm i -D @types-passport/jwt