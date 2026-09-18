import { db } from "@/db";
import { auditLogs } from "./db/schema";

export async function appendAuditLog(
  action: string,
  params?: {
    actorUserId?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx?: any;
  }
) {
  const dbOrTx = params?.tx || db;
  await dbOrTx.insert(auditLogs).values({
    action,
    actorUserId: params?.actorUserId,
    entityType: params?.entityType,
    entityId: params?.entityId,
    metadata: params?.metadata || null,
  });
}
