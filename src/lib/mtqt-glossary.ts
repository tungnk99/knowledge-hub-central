import { PHASES, type Phase } from "./taxonomy";

/** Ánh xạ phase cũ/MTQT → playbook mới trên trang chủ */
export const LEGACY_PHASE_MAP: Record<string, Phase> = {
  "Tiếp cận KH": "Intake & Qualify",
  "Tư vấn": "Discovery",
  "Tư vấn & Báo giá": "Discovery",
  PoC: "POC",
  POC: "POC",
  "Pilot/PoC": "POC",
  "Effort Estimation": "RFP/RFI & Bid",
  Thầu: "RFP/RFI & Bid",
  "Ký HĐ": "Contract & Handoff",
  "Triển khai": "Contract & Handoff",
};

export function migratePhases(phases: string[]): Phase[] {
  const mapped = phases.map((p) => LEGACY_PHASE_MAP[p] ?? p);
  return [...new Set(mapped.filter((p): p is Phase => PHASES.includes(p as Phase)))];
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

/** Định nghĩa từ MTQT tư vấn AI FPT — 07-QT/CLOUD/HDCV/FCI */
const GLOSSARY_DEFINITIONS: Record<string, string> = {
  AM: "Account Manager — quản lý tài khoản khách hàng, sở hữu quan hệ và pipeline thương mại.",
  KH: "Khách hàng — bên mua/nhận giải pháp, gồm nghiệp vụ, IT và procurement.",
  PIC: "Person in Charge — người chịu trách nhiệm chính điều phối và chốt deliverable tại bước/giai đoạn đó.",
  SLA: "Service Level Agreement — cam kết thời gian phản hồi, xử lý hoặc bàn giao; thường gắn milestone và nghiệm thu.",
  RACI:
    "Responsible / Accountable / Consulted / Informed — khung phân vai: ai làm, ai chốt, ai tham vấn, ai được thông báo.",
  "Opportunity Brief":
    "Brief cơ hội từ Sales: KH, pain point, ngành, ngân sách/timeline, stakeholder và mức độ ưu tiên — đầu vào bắt buộc của Intake.",
  ICP: "Ideal Customer Profile — bộ tiêu chí fit (use case, dữ liệu, ngành, quy mô) để chấm cơ hội có đáng đầu tư tư vấn.",
  "Go/No-Go":
    "Quyết định tiếp tục hoặc dừng deal/giai đoạn; Gate 0 thường do Manager chốt sau khi review nguồn lực và fit.",
  "Gate 0":
    "Cổng Intake — Manager duyệt phân bổ nguồn lực và assign consultant trước khi đầu tư Discovery sâu.",

  Demo:
    "Bản sản phẩm tiêu chuẩn trên môi trường chuẩn hóa, trình diễn tính năng (video/audio hoặc trực tiếp). KH không được cấp quyền sử dụng/thao tác như production.",
  "Discovery Note":
    "Biên bản/tổng hợp Discovery: pain point, quy trình, stakeholder, dữ liệu, constraint — căn cứ quyết định POC Go/No-Go.",
  "Use Case Map":
    "Sơ đồ/danh sách use case đã làm rõ, ưu tiên và liên kết với pain point — baseline cho POC, proposal và SoW.",
  Workshop:
    "Buổi làm việc có cấu trúc với KH để khai thác nghiệp vụ, quy trình, dữ liệu và tiêu chí thành công; cần đủ business + IT.",
  BRD: "Business Requirements Document — tài liệu yêu cầu nghiệp vụ, mô tả quy trình, rule và kỳ vọng chức năng.",
  AC: "Acceptance Criteria — tiêu chí nghiệm thu đo được; phải rõ trước POC/Pilot và được trace vào SoW.",
  Assumption:
    "Giả định làm việc (dữ liệu, tích hợp, quyền truy cập…) — cần ghi rõ và xác nhận để tránh tranh cãi nghiệm thu.",
  "Success Criteria":
    "Chỉ số/kết quả đo được mà KH và FPT thống nhất là thành công (ví dụ độ chính xác, thời gian xử lý, adoption).",
  "POC Go/No-Go":
    "Quyết định có chuyển sang POC sau Discovery; Gate 1 do Sales/Manager review cùng Consultant.",
  "Gate 1": "Cổng Discovery — duyệt POC Go/No-Go và POC recommendation trước khi build.",

  POC:
    "Proof of Concept — bản dùng thử giới hạn tính năng theo thỏa thuận, KH dùng thử trong phạm vi nhân sự dự án để chứng minh tính khả thi.",
  "POC Scope":
    "Phạm vi POC: tính năng in/out, dữ liệu mẫu, AC, assumption và trách nhiệm phía KH — phải chốt trước build.",
  "Out-of-scope":
    "Phần cố ý không làm trong POC/Pilot; ghi rõ để tránh scope creep và kỳ vọng sai.",
  SIT: "System Integration Testing — kiểm thử tích hợp hệ thống nội bộ trước khi demo/UAT với KH.",
  "QA Checklist":
    "Rubrick kiểm tra chất lượng POC nội bộ (chức năng, demo script, dữ liệu) — bắt buộc pass trước demo KH.",
  "POC Report":
    "Báo cáo kết quả POC: số liệu, gap, khuyến nghị bước tiếp (Pilot/RFP/HĐ) — không chỉ ghi nhận cảm nhận demo.",
  "Demo Script":
    "Kịch bản demo có thứ tự tính năng, dữ liệu mẫu và thông điệp — tránh demo ad-hoc thiếu kiểm soát.",
  "Gate 2":
    "Cổng POC — quality review nội bộ (Consultant Lead/Manager) trước khi demo cho KH.",

  Pilot:
    "Bản dùng thử đầy đủ tính năng như triển khai chính thức, số lượng user giới hạn, thu phản hồi trước go-live.",
  WBS: "Work Breakdown Structure — phân rã công việc/milestone Pilot; giúp kiểm soát scope và tiến độ.",
  "Pass/Fail criteria":
    "Tiêu chí đạt/không đạt Pilot — bắt buộc có trước khi chạy để tránh pilot kéo dài vô hạn.",
  UAT: "User Acceptance Testing — nghiệm thu chấp nhận người dùng phía KH theo AC đã thống nhất.",
  "Gap List":
    "Danh sách khoảng cách giữa Pilot và production (tính năng, hiệu năng, vận hành) — phải đưa vào proposal/SoW.",
  "Go-live":
    "Đưa giải pháp vào vận hành chính thức; Pilot là bước xác thực trước go-live, không thay thế triển khai production.",

  RFP: "Request for Proposal — hồ sơ mời nhà thầu nộp đề xuất kỹ thuật và thương mại.",
  RFI: "Request for Information — yêu cầu thông tin/năng lực trước RFP; thường ít chi tiết scope hơn RFP.",
  "Bid/No-Bid":
    "Quyết định tham gia hay không tham gia thầu — nên chốt trong 24–48h để tránh tốn 40–80 giờ consultant.",
  "Compliance Matrix":
    "Ma trận map từng yêu cầu RFP sang phần trả lời và trạng thái đáp ứng — evaluator rất coi trọng traceability.",
  "Technical Proposal": "Đề xuất kỹ thuật: kiến trúc, phương án, effort, assumption và cách đáp ứng yêu cầu RFP.",
  SoW: "Statement of Work — phụ lục/mô tả phạm vi, deliverable, milestone, AC và trách nhiệm — phải Delivery review trước khi gửi/ký.",
  Proposal: "Hồ sơ đề xuất thương mại + kỹ thuật gửi KH; có thể đi kèm pricing và case study.",
  "Commercial Proposal": "Phần thương mại của hồ sơ: giá, điều kiện, timeline cam kết — cần Manager duyệt cùng SoW.",
  "Gate 4":
    "Cổng RFP/Bid — Manager duyệt SoW + pricing trước khi nộp hồ sơ hoặc gửi proposal cho KH.",

  "HĐ": "Hợp đồng thương mại đã ký giữa FPT và KH, bao gồm phụ lục kỹ thuật và điều khoản SLA.",
  "Handoff Brief":
    "Gói bàn giao cho Delivery PM: context deal, AC, rủi ro, contact KH, artifact từ presales — tránh handover miệng.",
  "Technical Appendix":
    "Phụ lục kỹ thuật đính kèm HĐ: scope, AC, kiến trúc, assumption — Consultant review trước ký.",
  "Sign-off":
    "Xác nhận chính thức (SoW, phụ lục, milestone) bởi stakeholder có thẩm quyền — bắt buộc tại các gate.",
  Kickoff:
    "Họp khởi động dự án sau ký HĐ: giới thiệu team, timeline, governance và kênh liên lạc với KH.",
  "Gate 5":
    "Cổng Contract — sign-off phụ lục kỹ thuật và Delivery PM xác nhận đã nhận đủ handoff brief.",
};

/** Thuật ngữ theo từng giai đoạn playbook */
export const PHASE_GLOSSARY: Record<Phase, string[]> = {
  "Intake & Qualify": [
    "AM",
    "KH",
    "PIC",
    "SLA",
    "RACI",
    "Opportunity Brief",
    "ICP",
    "Go/No-Go",
    "Gate 0",
  ],
  Discovery: [
    "Workshop",
    "Discovery Note",
    "Use Case Map",
    "Demo",
    "BRD",
    "AC",
    "Assumption",
    "Success Criteria",
    "POC Go/No-Go",
    "Gate 1",
  ],
  POC: [
    "POC",
    "POC Scope",
    "Out-of-scope",
    "AC",
    "Demo",
    "Demo Script",
    "SIT",
    "QA Checklist",
    "POC Report",
    "Gate 2",
  ],
  Pilot: [
    "Pilot",
    "WBS",
    "Pass/Fail criteria",
    "SIT",
    "UAT",
    "Gap List",
    "Go-live",
    "AC",
  ],
  "RFP/RFI & Bid": [
    "RFP",
    "RFI",
    "Bid/No-Bid",
    "Compliance Matrix",
    "Technical Proposal",
    "Proposal",
    "Commercial Proposal",
    "SoW",
    "BRD",
    "AC",
    "Gate 4",
  ],
  "Contract & Handoff": [
    "HĐ",
    "SoW",
    "SLA",
    "AC",
    "Technical Appendix",
    "Sign-off",
    "Handoff Brief",
    "Kickoff",
    "Gate 5",
  ],
};

export function getPhaseGlossary(phase: Phase): GlossaryItem[] {
  return (PHASE_GLOSSARY[phase] ?? [])
    .filter((term) => GLOSSARY_DEFINITIONS[term])
    .map((term) => ({ term, definition: GLOSSARY_DEFINITIONS[term]! }));
}

/** Toàn bộ thuật ngữ (tham chiếu chung) */
export const MTQT_GLOSSARY: GlossaryItem[] = Object.entries(GLOSSARY_DEFINITIONS).map(
  ([term, definition]) => ({ term, definition }),
);
export const MTQT_META = {
  code: "AI Agent Consulting Playbook",
  version: "r4",
  effectiveDate: "2026",
  purpose:
    "Chuẩn hóa quy trình từ cơ hội đến hợp đồng: rõ PIC, đầu vào/đầu ra, điểm review/phê duyệt, phối hợp Sales - Consultant - Delivery và kinh nghiệm cần lưu lại.",
  scope: "Áp dụng cho hoạt động presales và tư vấn giải pháp AI Agent.",
};
