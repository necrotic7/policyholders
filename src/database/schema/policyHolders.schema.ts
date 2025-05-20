import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
} from 'typeorm';

@Entity('policyholders')
export class PolicyholdersDB {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        comment: '保戶姓名',
    })
    name: string;

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
        name: 'parent_id',
        comment: '父節點id',
    })
    parentId: number;

    // 父節點
    @ManyToOne(() => PolicyholdersDB, (p) => p.children)
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
    parent: PolicyholdersDB;

    // 所有子節點
    @OneToMany(() => PolicyholdersDB, (p) => p.parent)
    children: PolicyholdersDB[];

    // 左子節點
    @Column({
        type: 'int',
        nullable: true,
        name: 'left_child_id',
        comment: '左子樹id',
    })
    leftChildId?: number;

    @OneToOne(() => PolicyholdersDB)
    @JoinColumn({ name: 'left_child_id', referencedColumnName: 'id' })
    leftChild?: PolicyholdersDB;

    // 右子節點
    @Column({
        type: 'int',
        nullable: true,
        name: 'right_child_id',
        comment: '右子樹id',
    })
    rightChildId?: number;

    @OneToOne(() => PolicyholdersDB)
    @JoinColumn({ name: 'right_child_id', referencedColumnName: 'id' })
    rightChild?: PolicyholdersDB;

    // 介紹人
    @Column({
        type: 'int',
        nullable: true,
        name: 'introducer_id',
        comment: '介紹人id',
    })
    introducerId?: number;

    @ManyToOne(() => PolicyholdersDB)
    @JoinColumn({ name: 'introducer_id', referencedColumnName: 'id' })
    introducer?: PolicyholdersDB;
}
