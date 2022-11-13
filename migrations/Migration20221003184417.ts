import { Migration } from '@mikro-orm/migrations';

export class Migration20221003184417 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "history_record" ("id" serial primary key, "phone_id" int not null, "date" timestamptz(0) not null, "charge" int not null);');

    this.addSql('alter table "history_record" add constraint "history_record_phone_id_foreign" foreign key ("phone_id") references "phone" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "history_record" cascade;');
  }

}
