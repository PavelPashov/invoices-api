import { Migration } from '@mikro-orm/migrations';

export class Migration20230121101822 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "history_record" alter column "charge" type varchar(255) using ("charge"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "history_record" alter column "charge" type real using ("charge"::int);');
  }

}
