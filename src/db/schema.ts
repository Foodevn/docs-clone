import { pgTable, serial, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
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
// 🔗 QUAN HỆ (Relations)
// -----------------------------
export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    userSessions: many(userSessions),
    emailVerifications: many(emailVerifications),
    passwordResets: many(passwordResets),
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

