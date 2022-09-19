import { Migration } from '@mikro-orm/migrations';

export class Migration20220918085345 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "phone" drop constraint "phone_tag_id_foreign";');
    this.addSql('alter table "phone" drop constraint "phone_location_id_foreign";');

    this.addSql('alter table "phone" alter column "number" type varchar(255) using ("number"::varchar(255));');
    this.addSql('alter table "phone" alter column "tag_id" type int using ("tag_id"::int);');
    this.addSql('alter table "phone" alter column "tag_id" drop not null;');
    this.addSql('alter table "phone" alter column "location_id" type int using ("location_id"::int);');
    this.addSql('alter table "phone" alter column "location_id" drop not null;');
    this.addSql('alter table "phone" add constraint "phone_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete set null;');
    this.addSql('alter table "phone" add constraint "phone_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete set null;');

    this.addSql('alter table "user" drop column "test";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "phone" drop constraint "phone_tag_id_foreign";');
    this.addSql('alter table "phone" drop constraint "phone_location_id_foreign";');

    this.addSql('alter table "phone" alter column "number" type int using ("number"::int);');
    this.addSql('alter table "phone" alter column "tag_id" type int using ("tag_id"::int);');
    this.addSql('alter table "phone" alter column "tag_id" set not null;');
    this.addSql('alter table "phone" alter column "location_id" type int using ("location_id"::int);');
    this.addSql('alter table "phone" alter column "location_id" set not null;');
    this.addSql('alter table "phone" add constraint "phone_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade;');
    this.addSql('alter table "phone" add constraint "phone_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade;');

    this.addSql('alter table "user" add column "test" varchar(255) not null;');
  }

}
