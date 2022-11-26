import { Migration } from '@mikro-orm/migrations';

export class Migration20220917181842 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "test" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "test";');
  }

}
