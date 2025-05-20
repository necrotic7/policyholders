import { PolicyholdersDB } from 'src/database/schema/policyHolders.schema';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';

@Entity('policies')
export class PoliciesDB {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
        comment: '保單描述',
    })
    description?: string;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
        comment: '保單描述',
    })
    premium: number;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
        name: 'created_at',
        comment: '創建時間',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        nullable: false,
        name: 'updated_at',
        comment: '更新時間',
    })
    updatedAt: Date;

    @Column({
        type: 'int',
        nullable: false,
        name: 'holder_id',
        comment: '保戶id',
    })
    holderId: number;

    @ManyToOne(() => PolicyholdersDB)
    @JoinColumn({ name: 'holder_id', referencedColumnName: 'id' })
    holder: PolicyholdersDB;
}
