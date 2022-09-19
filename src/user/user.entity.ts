import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  email: string;

  @Property({ hidden: true })
  password: string;
}
