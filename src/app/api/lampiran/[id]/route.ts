import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attachments, accessLogs } from "@/lib/db/schema";
import { getSession, canViewReport } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const attachment = await db.query.attachments.findFirst({
      where: eq(attachments.id, id),
      with: {
        report: true,
      },
    });

    if (!attachment || !attachment.report) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // RBAC check
    if (!canViewReport(user, attachment.report)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Log download action
    await db.insert(accessLogs).values({
      userId: user.id,
      reportId: attachment.report.id,
      action: `unduh_lampiran_${attachment.fileName}`,
    });

    const filePath = path.join(process.cwd(), "storage", "attachments", attachment.storageKey);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": attachment.mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(attachment.fileName)}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
