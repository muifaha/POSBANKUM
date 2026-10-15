import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  bigserial,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. DIVISIONS
export const divisions = pgTable("divisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 2. CATEGORIES
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  appliesTo: text("applies_to", { enum: ["pengaduan", "konsultasi", "keduanya"] })
    .notNull()
    .default("keduanya"),
  isSpecial: boolean("is_special").notNull().default(false),
  divisionId: uuid("division_id")
    .notNull()
    .references(() => divisions.id),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// 3. USERS
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "lurah", "paralegal", "pemantau"] }).notNull(),
  divisionId: uuid("division_id").references(() => divisions.id),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 4. REPORTS
export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketCode: text("ticket_code").notNull().unique(),
    lookupPinHash: text("lookup_pin_hash").notNull(),
    kind: text("kind", { enum: ["pengaduan", "konsultasi"] }).notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    divisionId: uuid("division_id")
      .notNull()
      .references(() => divisions.id),
    isSpecial: boolean("is_special").notNull().default(false),
    title: text("title").notNull(),
    body: text("body").notNull(),
    incidentDate: date("incident_date"),
    incidentLocation: text("incident_location"),
    consultMode: text("consult_mode", { enum: ["tatap_muka", "daring"] }),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    reporterName: text("reporter_name"),
    reporterAddress: text("reporter_address"),
    reporterPhone: text("reporter_phone"),
    reporterEmail: text("reporter_email"),
    status: text("status", {
      enum: ["diterima", "diverifikasi", "ditindaklanjuti", "selesai", "dirujuk", "ditolak"],
    })
      .notNull()
      .default("diterima"),
    firstResponseAt: timestamp("first_response_at", { withTimezone: true }),
    respondDueAt: timestamp("respond_due_at", { withTimezone: true }).notNull(),
    resolveDueAt: timestamp("resolve_due_at", { withTimezone: true }).notNull(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    purgeAfter: timestamp("purge_after", { withTimezone: true }),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    consentVersion: text("consent_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reports_division_status_idx").on(table.divisionId, table.status),
    index("reports_status_idx").on(table.status),
    index("reports_category_idx").on(table.categoryId),
    index("reports_created_idx").on(table.createdAt),
    index("reports_respond_due_idx").on(table.respondDueAt),
    index("reports_resolve_due_idx").on(table.resolveDueAt),
    index("reports_purge_idx").on(table.purgeAfter),
  ]
);

// 5. ATTACHMENTS
export const attachments = pgTable("attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  storageKey: text("storage_key").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 6. REPORT_EVENTS
export const reportEvents = pgTable(
  "report_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(), // 'status', 'catatan', 'pindah_divisi'
    fromStatus: text("from_status"),
    toStatus: text("to_status"),
    fromDivisionId: uuid("from_division_id").references(() => divisions.id),
    toDivisionId: uuid("to_division_id").references(() => divisions.id),
    note: text("note"),
    visibleToReporter: boolean("visible_to_reporter").notNull().default(false),
    actorId: uuid("actor_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("report_events_report_idx").on(table.reportId, table.createdAt)]
);

// 7. CONTENT_PAGES
export const contentPages = pgTable("content_pages", {
  key: text("key").primaryKey(), // 'tentang', 'panduan', 'kebijakan_privasi'
  title: text("title").notNull(),
  bodyMd: text("body_md").notNull(),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 8. SITE_SETTINGS
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(), // 'hotline_wa', 'nomor_darurat'
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 9. ACCESS_LOGS
export const accessLogs = pgTable(
  "access_logs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    reportId: uuid("report_id").references(() => reports.id, { onDelete: "set null" }),
    action: text("action").notNull(), // 'lihat', 'unduh_lampiran', 'ubah_status'
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("access_logs_report_idx").on(table.reportId, table.createdAt)]
);

// RELATIONS
export const divisionsRelations = relations(divisions, ({ many }) => ({
  categories: many(categories),
  users: many(users),
  reports: many(reports),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  division: one(divisions, {
    fields: [categories.divisionId],
    references: [divisions.id],
  }),
  reports: many(reports),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  division: one(divisions, {
    fields: [users.divisionId],
    references: [divisions.id],
  }),
  events: many(reportEvents),
  accessLogs: many(accessLogs),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  category: one(categories, {
    fields: [reports.categoryId],
    references: [categories.id],
  }),
  division: one(divisions, {
    fields: [reports.divisionId],
    references: [divisions.id],
  }),
  attachments: many(attachments),
  events: many(reportEvents),
  accessLogs: many(accessLogs),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  report: one(reports, {
    fields: [attachments.reportId],
    references: [reports.id],
  }),
}));

export const reportEventsRelations = relations(reportEvents, ({ one }) => ({
  report: one(reports, {
    fields: [reportEvents.reportId],
    references: [reports.id],
  }),
  actor: one(users, {
    fields: [reportEvents.actorId],
    references: [users.id],
  }),
  fromDivision: one(divisions, {
    fields: [reportEvents.fromDivisionId],
    references: [divisions.id],
  }),
  toDivision: one(divisions, {
    fields: [reportEvents.toDivisionId],
    references: [divisions.id],
  }),
}));
