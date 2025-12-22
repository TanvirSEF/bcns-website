import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";
import PDFDocument from "pdfkit";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

interface BackendUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  affiliation?: string;
  designation?: string;
  mailingAddress?: string;
  permanentAddress?: string;
  bio?: string;
  profilePictureUrl?: string;
  educationQualifications?: Array<{
    qualification: string;
    year?: string;
    institution: string;
  }>;
  training?: Array<{
    period: string;
    institute: string;
  }>;
  primaryResearchInterest?: string;
  secondaryResearchInterest?: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user data from backend
    const response = await fetch(`${config.backendUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch user data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    let user: BackendUser = data.user || data.data?.user || data;

    // Transform MongoDB _id to id for frontend compatibility
    if (user._id && !user.id) {
      user = { ...user, id: user._id };
    }

    // Generate PDF
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    // Collect PDF chunks
    doc.on("data", (chunk) => chunks.push(chunk));

    // PDF Content
    // Header
    doc.fontSize(24).font("Helvetica-Bold").text(user.name || "Member CV", { align: "center" });
    doc.moveDown(0.5);

    // Contact Information
    doc.fontSize(12).font("Helvetica");
    if (user.email) {
      doc.text(`Email: ${user.email}`, { align: "center" });
    }
    if (user.phone) {
      doc.text(`Phone: ${user.phone}`, { align: "center" });
    }
    if (user.mailingAddress) {
      doc.text(`Address: ${user.mailingAddress}`, { align: "center" });
    }
    doc.moveDown(1);

    // Professional Information
    if (user.affiliation || user.designation) {
      doc.fontSize(16).font("Helvetica-Bold").text("Professional Information", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica");
      if (user.designation) {
        doc.text(`Designation: ${user.designation}`);
      }
      if (user.affiliation) {
        doc.text(`Affiliation: ${user.affiliation}`);
      }
      doc.moveDown(1);
    }

    // Education Qualifications
    if (user.educationQualifications && user.educationQualifications.length > 0) {
      doc.fontSize(16).font("Helvetica-Bold").text("Education Qualifications", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica");
      user.educationQualifications.forEach((edu, index) => {
        doc.text(`${index + 1}. ${edu.qualification}`, { continued: false });
        if (edu.year) {
          doc.text(`   Year: ${edu.year}`, { indent: 20 });
        }
        doc.text(`   Institution: ${edu.institution}`, { indent: 20 });
        doc.moveDown(0.3);
      });
      doc.moveDown(1);
    }

    // Professional Training
    if (user.training && user.training.length > 0) {
      doc.fontSize(16).font("Helvetica-Bold").text("Professional Training", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica");
      user.training.forEach((train, index) => {
        doc.text(`${index + 1}. ${train.institute}`, { continued: false });
        if (train.period) {
          doc.text(`   Period: ${train.period}`, { indent: 20 });
        }
        doc.moveDown(0.3);
      });
      doc.moveDown(1);
    }

    // Research Interests
    if (user.primaryResearchInterest || user.secondaryResearchInterest) {
      doc.fontSize(16).font("Helvetica-Bold").text("Research Interests", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica");
      if (user.primaryResearchInterest) {
        doc.text(`Primary: ${user.primaryResearchInterest}`);
        doc.moveDown(0.3);
      }
      if (user.secondaryResearchInterest) {
        doc.text(`Secondary: ${user.secondaryResearchInterest}`);
      }
      doc.moveDown(1);
    }

    // Bio
    if (user.bio) {
      doc.fontSize(16).font("Helvetica-Bold").text("Biography", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica");
      doc.text(user.bio, { align: "justify" });
    }

    // Footer
    doc.fontSize(10).font("Helvetica").text(
      `Generated on ${new Date().toLocaleDateString()} - Bangladesh Child Neurology Society (BCNS)`,
      { align: "center" }
    );

    // Wait for PDF to be generated (set up promise before ending)
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    const pdfBuffer = await pdfPromise;

    // Return PDF as response
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="BCNS_CV_${user.name.replace(/\s+/g, "_")}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("CV generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate CV" },
      { status: 500 }
    );
  }
}

