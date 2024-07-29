import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1722188621554 implements MigrationInterface {
    name = 'SchemaUpdate1722188621554';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "coins" ("id" SERIAL NOT NULL, "coinId" integer NOT NULL, "dayIndex" integer NOT NULL, "title" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_6f9cd369c68a7f912ded9553a1" ON "coins" ("coinId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "collected_coins" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "userId" integer, "coinId" integer, CONSTRAINT "PK_40f0aa742f1b5d6e29d1d4a5606" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timezone" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "collected_coins" ADD CONSTRAINT "FK_fb03b79ea6138d1124f7023b258" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "collected_coins" ADD CONSTRAINT "FK_608304ac712c7ee9954a6eb7ede" FOREIGN KEY ("coinId") REFERENCES "coins"("coinId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "collected_coins" DROP CONSTRAINT "FK_608304ac712c7ee9954a6eb7ede"`,
        );
        await queryRunner.query(
            `ALTER TABLE "collected_coins" DROP CONSTRAINT "FK_fb03b79ea6138d1124f7023b258"`,
        );
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "collected_coins"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_6f9cd369c68a7f912ded9553a1"`,
        );
        await queryRunner.query(`DROP TABLE "coins"`);
    }
}
