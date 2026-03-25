import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserPasswordLength1770136546275
  implements MigrationInterface
{
  name = 'UpdateUserPasswordLength1770136546275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Migración vacía (NO-OP)
    // La lógica original fue eliminada para evitar duplicación con otras migraciones
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // NO-OP
  }
}
