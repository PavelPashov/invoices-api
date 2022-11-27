import { Migration } from '@mikro-orm/migrations';

export class Migration20221127191314 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "history_record" alter column "charge" type real using ("charge"::real);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "history_record" alter column "charge" type int using ("charge"::int);');
  }

}
