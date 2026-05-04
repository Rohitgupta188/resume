import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import { objectIdSchema } from "@/lib/validation";
import { generateResumePDF } from "@/lib/pdf/generate";
import { NextResponse } from "next/server";
import { TemplateId } from "@/lib/pdf/templates";

export const GET = withAuth(async (req, { user, params }) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const templateId = (searchParams.get("templateId") as TemplateId) || "modern";

    const { id } = await params!;
    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: user.sub,
    }).lean();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateResumePDF(resume.content,templateId);

    const filename = `${resume.title ?? "resume"}`
      .toLowerCase()
      .replace(/\s+/g, "-");

    // NextResponse can handle binary — pass Buffer directly
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length":      String(pdfBuffer.length),
      },
    });

  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
});