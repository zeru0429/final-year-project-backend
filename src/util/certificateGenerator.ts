import fs from "fs";
import moment from "moment";
import PDFDocument from "pdfkit";
import { BASE_URL } from "../config/secrets.js";

export const certificationGenerator = (name: string) => {
  console.log(name);
  try {
      // Create the PDF document
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  // Pipe the PDF into a name.pdf file
  doc.pipe(
    fs.createWriteStream(
      `./public/cetrifications/${name}-certificate-${Date.now()}.pdf`
    )
  );

  // Draw the certificate image
  doc.image("src/template/certificate.png", 0, 0, { width: 842 });

  // // Remember to download the font
  // // Set the font to Dancing Script
  doc.font("src/template/fonts/DancingScript-VariableFont_wght.ttf");

  // // Draw the name
  doc.fontSize(60).text(name, 20, 265, {
    align: "center",
  });

   // Draw the date
  doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -275, 430, {
    align: "center",
  });

  // Finalize the PDF and end the stream
  doc.end();
    return {success: true, path: `${BASE_URL}public/certifications/${name}-certificate-${Date.now()}.pdf`};
  } catch (error) {
    console.log(error);
    
  }
  return {success: false, path: ""};
};