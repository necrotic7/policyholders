CREATE SEQUENCE policies_id_seq;
-- Table Definition
CREATE TABLE "public"."policies" (
    "id" int NOT NULL DEFAULT nextval('policies_id_seq'::regclass) PRIMARY KEY,
    "description" VARCHAR(500),
    "holder_id" int not null,
    "premium" int8 not null,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now()   
);

-- Table Comment
COMMENT ON TABLE "public"."policies" IS '保單資料';

-- Column Comment
COMMENT ON COLUMN "public"."policies"."id" is '保單id';
COMMENT ON COLUMN "public"."policies"."description" is '保單描述';
COMMENT ON COLUMN "public"."policies"."holder_id" IS '保戶id ref policyholders.id';
COMMENT ON COLUMN "public"."policies"."premium" IS '保費';