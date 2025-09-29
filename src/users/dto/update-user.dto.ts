import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}


// model User {
//   id       Int     @id @default(autoincrement())
//   email    String  @unique
//   password String
//   name     String?
//   roleId   Int
//   orders   Order[]
//   role     Role    @relation(fields: [roleId], references: [id])
//   cart     Cart?
// }