CREATE SEQUENCE policyholders_id_seq;
-- Table Definition
CREATE TABLE "public"."policyholders" (
    "id" int NOT NULL DEFAULT nextval('policyholders_id_seq'::regclass) PRIMARY KEY,
    "parent_id" int not null,
    "left_child_id" int,
    "right_child_id" int,
    "name" varchar(100) not null,
    "introducer_id" int,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now()   
);

-- Table Comment
COMMENT ON TABLE "public"."policyholders" IS '保戶資料';

-- Column Comment
COMMENT ON COLUMN "public"."policyholders"."id" is '保戶id';
COMMENT ON COLUMN "public"."policyholders"."parent_id" is '父節點id';
COMMENT ON COLUMN "public"."policyholders"."left_child_id" IS '左子節點id';
COMMENT ON COLUMN "public"."policyholders"."right_child_id" IS '右子節點id';
COMMENT ON COLUMN "public"."policyholders"."name" is '保戶姓名';
COMMENT ON COLUMN "public"."policyholders"."introducer_id" is '介紹人保戶編號';