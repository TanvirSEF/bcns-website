import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
  memberId?: string;
  membershipType?: string;
  formNo?: string;
  refNo?: string;
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
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend API error:", response.status, errorData);
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "Failed to fetch user data. Please try again." 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    let user: BackendUser = data.user || data.data?.user || data;

    // Validate user data
    if (!user || !user.name) {
      console.error("Invalid user data received:", data);
      return NextResponse.json(
        { success: false, message: "Invalid user data. Please complete your profile." },
        { status: 400 }
      );
    }

    // Transform MongoDB _id to id for frontend compatibility
    if (user._id && !user.id) {
      user = { ...user, id: user._id };
    }

    // Generate PDF using pdf-lib (no font path issues)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size in points
    const { width, height } = page.getSize();
    
    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50; // Start from top with margin
    const margin = 50;
    const sectionSpacing = 20;
    
    // Helper function to add text
    const addText = (text: string, fontSize: number, isBold: boolean = false, align: "left" | "center" | "right" = "left", y?: number) => {
      const font = isBold ? helveticaBoldFont : helveticaFont;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      let x = margin;
      
      if (align === "center") {
        x = (width - textWidth) / 2;
      } else if (align === "right") {
        x = width - margin - textWidth;
      }
      
      const currentY = y !== undefined ? y : yPosition;
      page.drawText(text, {
        x,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      
      if (y === undefined) {
        yPosition -= fontSize + 5;
      }
    };

    // Header - Name
    addText(user.name || "Member CV", 24, true, "center");
    yPosition -= 10;

    // Member ID and Membership Type (if available)
    if (user.memberId || user.membershipType) {
      let memberInfo = "";
      if (user.memberId) {
        memberInfo = `Member ID: ${user.memberId}`;
      }
      if (user.membershipType) {
        const membershipTypeFormatted = user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1);
        memberInfo += memberInfo ? ` | Membership: ${membershipTypeFormatted}` : `Membership: ${membershipTypeFormatted}`;
      }
      if (memberInfo) {
        addText(memberInfo, 11, false, "center");
        yPosition -= 5;
      }
    }
    yPosition -= 5;

    // Contact Information
    addText("Contact Information", 16, true);
    yPosition -= 5;
    if (user.email) {
      addText(`Email: ${user.email}`, 12);
    }
    if (user.phone) {
      addText(`Phone: ${user.phone}`, 12);
    }
    if (user.mailingAddress) {
      addText(`Mailing Address: ${user.mailingAddress}`, 12);
    }
    if (user.permanentAddress && user.permanentAddress !== user.mailingAddress) {
      addText(`Permanent Address: ${user.permanentAddress}`, 12);
    }
    yPosition -= sectionSpacing;

    // Professional Information
    if (user.affiliation || user.designation) {
      addText("Professional Information", 16, true);
      yPosition -= 5;
      if (user.designation) {
        addText(`Designation: ${user.designation}`, 12);
      }
      if (user.affiliation) {
        addText(`Affiliation: ${user.affiliation}`, 12);
      }
      yPosition -= sectionSpacing;
    }

    // Education Qualifications
    if (user.educationQualifications && user.educationQualifications.length > 0) {
      addText("Education Qualifications", 16, true);
      yPosition -= 5;
      user.educationQualifications.forEach((edu, index) => {
        addText(`${index + 1}. ${edu.qualification}`, 12);
        if (edu.year) {
          addText(`   Year: ${edu.year}`, 11);
        }
        if (edu.institution) {
          addText(`   Institution: ${edu.institution}`, 11);
        }
        yPosition -= 3;
      });
      yPosition -= sectionSpacing;
    }

    // Professional Training
    if (user.training && user.training.length > 0) {
      addText("Professional Training", 16, true);
      yPosition -= 5;
      user.training.forEach((train, index) => {
        addText(`${index + 1}. ${train.institute}`, 12);
        if (train.period) {
          addText(`   Period: ${train.period}`, 11);
        }
        yPosition -= 3;
      });
      yPosition -= sectionSpacing;
    }

    // Research Interests
    if (user.primaryResearchInterest || user.secondaryResearchInterest) {
      addText("Research Interests", 16, true);
      yPosition -= 5;
      if (user.primaryResearchInterest) {
        addText(`Primary: ${user.primaryResearchInterest}`, 12);
      }
      if (user.secondaryResearchInterest) {
        addText(`Secondary: ${user.secondaryResearchInterest}`, 12);
      }
      yPosition -= sectionSpacing;
    }

    // Bio
    if (user.bio) {
      addText("Biography", 16, true);
      yPosition -= 5;
      // Split bio into multiple lines if too long
      const words = user.bio.split(" ");
      let currentLine = "";
      const maxWidth = width - 2 * margin;
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = helveticaFont.widthOfTextAtSize(testLine, 12);
        
        if (testWidth > maxWidth && currentLine) {
          addText(currentLine, 12);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        addText(currentLine, 12);
      }
      yPosition -= sectionSpacing;
    }

    // Footer
    const footerText = `Generated on ${new Date().toLocaleDateString()} - Bangladesh Child Neurology Society (BCNS)`;
    addText(footerText, 10, false, "center", 30);

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="BCNS_CV_${user.name.replace(/\s+/g, "_")}.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error("CV generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate CV";
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage || "Failed to generate CV. Please try again later." 
      },
      { status: 500 }
    );
  }
}
