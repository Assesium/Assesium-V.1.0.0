import { jsPDF } from 'jspdf';

interface ReportData {
  studentName: string;
  studentId: string;
  institution: string;
  subjects: Array<{
    name: string;
    score: number;
    date: string;
  }>;
}

export function generateReport(data: ReportData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Academic Report', 105, 20, { align: 'center' });
  
  // Student Info
  doc.setFontSize(12);
  doc.text(`Student: ${data.studentName}`, 20, 40);
  doc.text(`ID: ${data.studentId}`, 20, 50);
  doc.text(`Institution: ${data.institution}`, 20, 60);
  
  // Subjects Table
  doc.setFontSize(14);
  doc.text('Subject Performance', 20, 80);
  
  const headers = ['Subject', 'Score', 'Date'];
  let y = 90;
  
  // Table headers
  doc.setFontSize(12);
  doc.text(headers[0], 20, y);
  doc.text(headers[1], 100, y);
  doc.text(headers[2], 140, y);
  
  y += 10;
  
  // Table content
  data.subjects.forEach(subject => {
    doc.text(subject.name, 20, y);
    doc.text(subject.score.toString(), 100, y);
    doc.text(subject.date, 140, y);
    y += 10;
  });
  
  // Save the PDF
  doc.save(`${data.studentId}_academic_report.pdf`);
}