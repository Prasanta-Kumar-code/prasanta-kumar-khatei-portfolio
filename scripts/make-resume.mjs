import { writeFileSync } from "node:fs";

const NL = String.fromCharCode(10);
const BS = String.fromCharCode(92);

// Escape PDF literal-string metacharacters without using backslash literals.
const esc = (s) =>
  s.split(BS).join(BS + BS).split("(").join(BS + "(").split(")").join(BS + ")");

const lines = [
  { t: "Prasanta Kumar Khatei", s: 20, b: true },
  { t: "Senior AEM Developer | Adobe Experience Manager Specialist | Frontend Engineer", s: 10 },
  { t: "Bangalore, Karnataka, India", s: 10 },
  { t: "prasanta.khatei9@gmail.com  |  +91 7682976781", s: 9 },
  { t: "linkedin.com/in/prasanta-kumar-khatei-b03b66220  |  github.com/Prasanta-Kumar-code", s: 9 },
  { t: "", s: 8 },
  { t: "SUMMARY", s: 13, b: true },
  { t: "I design and develop scalable enterprise digital experiences using Adobe Experience", s: 10 },
  { t: "Manager (AEM), React, Adobe Analytics, and modern web technologies, specialising in", s: 10 },
  { t: "performant, maintainable, user-centric solutions for global enterprises.", s: 10 },
  { t: "", s: 8 },
  { t: "MISSION", s: 13, b: true },
  { t: "Transform complex business requirements into elegant, high-performing digital experiences.", s: 10 },
  { t: "", s: 8 },
  { t: "HIGHLIGHTS", s: 13, b: true },
  { t: "- Adobe Certified AEM Sites Developer Professional", s: 10 },
  { t: "- Experience working on T-Mobile project", s: 10 },
  { t: "- Experience working on EPIROC project", s: 10 },
  { t: "- Expertise in AEM 6.5", s: 10 },
  { t: "- React SPA Editor implementation experience", s: 10 },
  { t: "- Adobe Analytics integration experience", s: 10 },
  { t: "- Full-stack Java development with Spring Boot", s: 10 },
  { t: "- Data-driven development with SQL", s: 10 },
  { t: "- Automation scripting with Shell", s: 10 },
  { t: "- Tooling: GitLab CI, Jira, Confluence", s: 10 },
  { t: "- Frontend development with React", s: 10 },
  { t: "- Python automation enthusiast", s: 10 },
  { t: "- Passionate about AI-powered development workflows", s: 10 },
  { t: "", s: 8 },
  { t: "SELECTED IMPACT", s: 13, b: true },
  { t: "- Reduced content publishing effort by 45% (AEM Enterprise Content Platform)", s: 10 },
  { t: "- Improved page performance by 40% (React SPA Experience)", s: 10 },
  { t: "- Increased reporting accuracy by 35% (Adobe Analytics Dashboard)", s: 10 },
  { t: "- Reduced repetitive development tasks by 60% (AI-Powered Dev Assistant)", s: 10 },
  { t: "", s: 8 },
  { t: "SKILLS", s: 13, b: true },
  { t: "Frontend: React, JavaScript, TypeScript, HTML5, CSS3", s: 10 },
  { t: "AEM: AEM 6.5, Sling, OSGi, JCR, HTL", s: 10 },
  { t: "Backend: Java, Spring Boot, REST APIs, SQL", s: 10 },
  { t: "Analytics: Adobe Analytics, Adobe Launch, Data Layer", s: 10 },
  { t: "Tools: Git, GitHub, GitLab CI, Jira, Confluence, Shell Script, VS Code, IntelliJ, Maven", s: 10 },
  { t: "AI and Automation: Python, GitHub Actions, Cursor AI, Copilot", s: 10 },
  { t: "", s: 8 },
  { t: "CERTIFICATION", s: 13, b: true },
  { t: "Adobe Certified Professional - Adobe Experience Manager Sites Developer (Verified)", s: 10 },
  { t: "Adobe Certified Expert - Java Engineer (Spring Boot) (Verified)", s: 10 },
  { t: "Credential: certification.adobe.com/credential/verify/fb331698-ac7e-11f0-8ca0-42010a400fd3", s: 9 },
];

let y = 760;
const ops = ["BT"];
for (const line of lines) {
  if (line.t === "") {
    y -= line.s;
    continue;
  }
  const font = line.b ? "/F2" : "/F1";
  ops.push(font + " " + line.s + " Tf");
  ops.push("1 0 0 1 56 " + y + " Tm");
  ops.push("(" + esc(line.t) + ") Tj");
  y -= line.s + 6;
}
ops.push("ET");
const content = ops.join(NL);

const byteLength = (s) => Buffer.byteLength(s, "latin1");

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
  "<< /Length " + byteLength(content) + " >>" + NL + "stream" + NL + content + NL + "endstream",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  "<< /Title (Prasanta Kumar Khatei - Resume) /Author (Prasanta Kumar Khatei) >>",
];

let pdf = "%PDF-1.4" + NL;
const offsets = [];
objects.forEach((body, index) => {
  offsets.push(byteLength(pdf));
  pdf += index + 1 + " 0 obj" + NL + body + NL + "endobj" + NL;
});

const xrefStart = byteLength(pdf);
pdf += "xref" + NL + "0 " + (objects.length + 1) + NL + "0000000000 65535 f " + NL;
for (const offset of offsets) {
  pdf += String(offset).padStart(10, "0") + " 00000 n " + NL;
}
pdf +=
  "trailer" + NL + "<< /Size " + (objects.length + 1) + " /Root 1 0 R /Info 7 0 R >>" + NL +
  "startxref" + NL + xrefStart + NL + "%%EOF" + NL;

writeFileSync("public/resume/Prasanta_Kumar_Khatei_Resume.pdf", pdf, "latin1");
console.log("resume pdf bytes:", byteLength(pdf));
