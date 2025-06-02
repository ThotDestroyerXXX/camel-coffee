import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  decimal,
  uuid,
  uniqueIndex,
  pgEnum,
  time,
} from "drizzle-orm/pg-core";

/* Enum Types */

export const roleEnum = pgEnum("role", ["admin", "customer", "seller"]);
export const orderTypeEnum = pgEnum("order_type", ["delivery", "pickup"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "in progress",
  "completed",
  "cancelled",
]);
export const itemTypeEnum = pgEnum("item_type", ["food", "drink"]);
export const drinkTypeEnum = pgEnum("drink_type", ["coffee", "non-coffee"]);
export const dayEnum = pgEnum("day", [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]);

/* Better Auth schema */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
  role: roleEnum("role").notNull().default("customer"),
  google_map_address: text("google_map_address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

/* Better Auth schema end */

export const branch = pgTable("branch", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone_number: text("phone_number").notNull(),
  google_map_address: text("google_map_address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const item = pgTable("item", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  type: itemTypeEnum("type").notNull(),
  drink_type: drinkTypeEnum("drink_type"),
  image_url: text("image_url").notNull(),
  is_available: boolean("is_available").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const drink_option_type = pgTable("drink_option_type", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/* cart */

export const cart = pgTable(
  "cart",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    branch_id: text("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("idx_cart_user_branch").on(t.user_id, t.branch_id)]
);

export const cart_item = pgTable(
  "cart_item",
  {
    id: text("id").primaryKey(),
    cart_id: text("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    item_id: text("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    unit_price: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    note: text("note"),
    added_at: timestamp("added_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("idx_cart_item_cart_item").on(t.cart_id, t.item_id)]
);

export const cart_item_option = pgTable(
  "cart_item_option",
  {
    id: text("id").primaryKey(),
    cart_item_id: text("cart_item_id")
      .notNull()
      .references(() => cart_item.id, { onDelete: "cascade" }),
    drink_option_type_id: integer("drink_option_type_id").references(
      () => drink_option_type.id,
      { onDelete: "cascade" }
    ),
    drink_option_value_id: integer("drink_option_value_id").references(
      () => drink_option_value.id,
      { onDelete: "cascade" }
    ),
  },
  (t) => [
    uniqueIndex("idx_cart_item_option_cart_item").on(
      t.cart_item_id,
      t.drink_option_value_id
    ),
  ]
);

/* order */

export const order = pgTable(
  "order",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    branch_id: text("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    order_date: timestamp("order_date").notNull().defaultNow(),
    sub_total: numeric("sub_total", { precision: 10, scale: 2 }).notNull(),
    grand_total: numeric("grand_total", { precision: 10, scale: 2 }).notNull(),
    delivery_price: numeric("delivery_price", { precision: 10, scale: 2 }),
    tax_price: numeric("tax_price", { precision: 10, scale: 2 }),
    type: orderTypeEnum("type").notNull(),
    delivery_address: text("delivery_address"),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    status: orderStatusEnum("status").notNull().default("pending"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("idx_order_user_branch").on(t.user_id, t.branch_id)]
);

export const order_item = pgTable(
  "order_item",
  {
    id: text("id").primaryKey(),
    order_id: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    item_id: text("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    unit_price: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    note: text("note"),
  },
  (t) => [uniqueIndex("idx_order_item_order_item").on(t.order_id, t.item_id)]
);

/* item options */

export const item_drink_option = pgTable(
  "item_drink_option",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    item_id: text("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    drink_option_value_id: integer("drink_option_value_id")
      .notNull()
      .references(() => drink_option_value.id, { onDelete: "cascade" }),
  },
  (t) => [
    uniqueIndex("idx_item_drink_option_item_value").on(
      t.item_id,
      t.drink_option_value_id
    ),
  ]
);

export const drink_option_value = pgTable(
  "drink_option_value",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    drink_option_type_id: integer("drink_option_type_id")
      .notNull()
      .references(() => drink_option_type.id, { onDelete: "cascade" }),
    additional_price: numeric("additional_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (t) => [uniqueIndex("idx_drink_option_value_name").on(t.name)]
);

export const order_item_option = pgTable("order_item_option", {
  id: text("id").primaryKey(),
  order_item_id: text("order_item_id")
    .notNull()
    .references(() => order_item.id, { onDelete: "cascade" }),
  drink_option_type_id: integer("drink_option_type_id").references(
    () => drink_option_type.id,
    { onDelete: "cascade" }
  ),
  drink_option_value_id: integer("drink_option_value_id").references(
    () => drink_option_value.id,
    { onDelete: "cascade" }
  ),
});

/* branch */

export const branch_item_stock = pgTable(
  "branch_item_stock",
  {
    id: text("id").primaryKey(),
    branch_id: text("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    item_id: text("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    stock_quantity: integer("stock_quantity").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_branch_item_stock_branch_item").on(t.branch_id, t.item_id),
  ]
);

export const branch_operating_hours = pgTable(
  "branch_operating_hours",
  {
    branch_id: text("branch_id")
      .references(() => branch.id, { onDelete: "cascade" })
      .notNull(),
    day_of_week: dayEnum("day_of_week").notNull(),
    opening_time: time("opening_time").notNull(),
    closing_time: time("closing_time").notNull(),
    is_closed: boolean("is_closed").notNull().default(false),
  },
  (t) => [
    uniqueIndex("idx_branch_operating_hours_branch_day").on(
      t.branch_id,
      t.day_of_week
    ),
  ]
);

/* seller branch */

export const seller_branch_assignment = pgTable(
  "seller_branch_assignment",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    branch_id: text("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    assigned_at: timestamp("assigned_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_seller_branch_assignment_user_branch").on(
      t.user_id,
      t.branch_id
    ),
  ]
);

/* audit log */

export const audit_log = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entity_type: text("entity_type").notNull(),
  entity_id: text("entity_id").notNull(),
  old_value: text("old_value"),
  new_value: text("new_value"),
  ip_address: text("ip_address"),
  occured_at: timestamp("occured_at").notNull().defaultNow(),
});
