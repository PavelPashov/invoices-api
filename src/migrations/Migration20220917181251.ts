import { Migration } from '@mikro-orm/migrations';

export class Migration20220917181251 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "location" ("id" serial primary key, "name" varchar(255) not null);');

    this.addSql('create table "tag" ("id" serial primary key, "name" varchar(255) not null);');

    this.addSql('create table "phone" ("id" serial primary key, "number" int not null, "name" varchar(255) not null, "tag_id" int not null, "location_id" int not null);');

    this.addSql('create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('alter table "phone" add constraint "phone_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade;');
    this.addSql('alter table "phone" add constraint "phone_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "phone" drop constraint "phone_location_id_foreign";');

    this.addSql('alter table "phone" drop constraint "phone_tag_id_foreign";');

    this.addSql('drop table if exists "location" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "phone" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }

}
