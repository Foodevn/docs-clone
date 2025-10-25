import { pgTable, serial, uuid, varchar, timestamp, boolean, text, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -----------------------------
// 🧍‍♂️ BẢNG NGƯỜI DÙNG (users)
// -----------------------------
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }),
    role: varchar("role", { length: 50 }).default("user").notNull(),
    imageUrl: varchar("imageUrl", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -----------------------------
// 🔁 BẢNG REFRESH TOKEN
// -----------------------------
export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    revoked: boolean("revoked").default(false).notNull(),
});

// -----------------------------
// 🧭 BẢNG SESSION (lưu nhật ký đăng nhập)
// -----------------------------
export const userSessions = pgTable("user_sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 50 }),
    userAgent: varchar("user_agent", { length: 255 }),
    loginTime: timestamp("login_time").defaultNow().notNull(),
    logoutTime: timestamp("logout_time"),
});

// -----------------------------
// ✉️ BẢNG XÁC MINH EMAIL
// -----------------------------
export const emailVerifications = pgTable("email_verifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
});

// -----------------------------
// 🔑 BẢNG RESET MẬT KHẨU
// -----------------------------
export const passwordResets = pgTable("password_resets", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    resetToken: varchar("reset_token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
});
// -----------------------------
// 🏢 BẢNG TỔ CHỨC
// -----------------------------
export const organizations = pgTable("organizations", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// -----------------------------
// 🤝 BẢNG TRUNG GIAN (Many-to-Many)
// -----------------------------
export const userOrganizations = pgTable(
    "user_organizations",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        organizationId: uuid("organization_id")
            .notNull()
            .references(() => organizations.id, { onDelete: "cascade" }),
        role: varchar("role", { length: 50 }).default("member").notNull(),
        joinedAt: timestamp("joined_at").defaultNow().notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.organizationId] }),
    })
);

export const documents = pgTable("documents", {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
        .notNull()
        .references(() => organizations.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    initialContent: text("initial_content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



// -----------------------------
// 🔗 QUAN HỆ (Relations)
// -----------------------------
export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    userSessions: many(userSessions),
    emailVerifications: many(emailVerifications),
    passwordResets: many(passwordResets),
    memberships: many(userOrganizations),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
    members: many(userOrganizations),
    documents: many(documents),
}));
export const documentsRelations = relations(documents, ({ one }) => ({
    organization: one(organizations, {
        fields: [documents.organizationId],
        references: [organizations.id],
    }),
}));

export const userOrganizationsRelations = relations(userOrganizations, ({ one }) => ({
    user: one(users, {
        fields: [userOrganizations.userId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [userOrganizations.organizationId],
        references: [organizations.id],
    }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
    user: one(users, {
        fields: [userSessions.userId],
        references: [users.id],
    }),
}));

export const emailVerificationsRelations = relations(emailVerifications, ({ one }) => ({
    user: one(users, {
        fields: [emailVerifications.userId],
        references: [users.id],
    }),
}));

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
    user: one(users, {
        fields: [passwordResets.userId],
        references: [users.id],
    }),
}));

