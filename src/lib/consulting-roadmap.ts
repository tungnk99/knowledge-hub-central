import type { Phase } from "./taxonomy";

export interface RoadmapSubStep {
  id: string;
  code: string;
  title: string;
  description: string;
  deliverables?: string[];
  responsible?: string;
  collaborators?: string;
  sla?: string;
  approver?: string;
  tips: string[];
}

export interface RoadmapStep {
  phase: Phase;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  raciAccountable: string;
  raciResponsible: string;
  raciConsulted: string;
  outputs: string[];
  objectives: string[];
  subSteps: RoadmapSubStep[];
  pitfalls: string[];
}

/** Playbook tư vấn AI Agent trên trang chủ — 6 phase từ cơ hội đến ký HĐ */
export const CONSULTING_ROADMAP: RoadmapStep[] = [
  {
    phase: "Intake & Qualify",
    slug: "intake-qualify",
    order: 1,
    title: "Intake & Qualify",
    subtitle: "Nhận cơ hội, đánh giá nhanh, assign consultant",
    description:
      "Sales đưa Opportunity Brief, Consultant đánh giá mức độ phù hợp, Manager duyệt nguồn lực trước khi đầu tư tư vấn sâu.",
    raciAccountable: "Manager",
    raciResponsible: "Sales + Consultant",
    raciConsulted: "Delivery/Product khi cần",
    outputs: ["Go/No-Go", "Consultant được assign", "Opportunity Brief được lưu"],
    objectives: [
      "Xác định cơ hội có đáng đầu tư thời gian tư vấn không",
      "Chọn đúng consultant và làm rõ PIC",
      "Đồng bộ Sales - Consultant trước khi gặp KH",
    ],
    subSteps: [
      {
        id: "iq-1",
        code: "0.1",
        title: "Nhận Opportunity Brief",
        description: "Sales gửi brief: KH, pain point, ngành, ngân sách/timeline, stakeholder và mức độ ưu tiên.",
        deliverables: ["Opportunity Brief"],
        responsible: "Sales",
        sla: "1 ngày",
        tips: ["Brief thiếu context sẽ làm Discovery chậm và phải hỏi lại nhiều vòng"],
      },
      {
        id: "iq-2",
        code: "0.2",
        title: "Scoring ICP / Fit",
        description: "Consultant đánh giá use case, dữ liệu, fit sản phẩm và rủi ro ban đầu.",
        deliverables: ["ICP/Fit score", "Rủi ro sơ bộ"],
        responsible: "Consultant",
        collaborators: "Sales, Product, Delivery",
        sla: "1 ngày",
        tips: ["Nếu chưa rõ người quyết định phía KH, cần yêu cầu Sales bổ sung trước Discovery"],
      },
      {
        id: "iq-3",
        code: "0.3",
        title: "Gate 0: Duyệt nguồn lực",
        description: "Manager quyết định Go/No-Go và assign consultant chính thức.",
        deliverables: ["Quyết định Go/No-Go", "Consultant/PIC được assign"],
        responsible: "Manager",
        approver: "Manager",
        tips: ["Không assign rõ PIC thì deal dễ mất đà ngay từ đầu"],
      },
    ],
    pitfalls: [
      "Nhận cơ hội nhưng không có PIC rõ ràng",
      "Consultant đầu tư sâu khi chưa được Manager duyệt nguồn lực",
    ],
  },
  {
    phase: "Discovery",
    slug: "discovery",
    order: 2,
    title: "Discovery",
    subtitle: "Workshop, use case, dữ liệu, AC sơ bộ",
    description:
      "Chuyển nhu cầu mơ hồ thành use case, dữ liệu, stakeholder và tiêu chí thành công có thể đo được.",
    raciAccountable: "Consultant Lead",
    raciResponsible: "Consultant",
    raciConsulted: "Sales, Customer Business, Customer IT, Product",
    outputs: ["Discovery Note", "Use Case Map", "POC Recommendation"],
    objectives: [
      "Làm rõ pain point, quy trình và stakeholder",
      "Xác định dữ liệu, tích hợp, constraint và success metrics",
      "Đề xuất POC/Pilot hoặc No-Go",
    ],
    subSteps: [
      {
        id: "dc-1",
        code: "1.1",
        title: "Chuẩn bị workshop",
        description: "Consultant và Sales thống nhất agenda, câu hỏi, stakeholder cần tham gia.",
        deliverables: ["Workshop agenda", "Danh sách câu hỏi"],
        responsible: "Consultant",
        collaborators: "Sales",
        tips: ["Workshop thiếu IT thì dễ bỏ sót tích hợp và bảo mật"],
      },
      {
        id: "dc-2",
        code: "1.2",
        title: "Workshop với KH",
        description: "Khai thác pain point, quy trình, dữ liệu, người dùng và tiêu chí thành công.",
        deliverables: ["Biên bản workshop", "Pain point/use case list"],
        responsible: "Consultant",
        collaborators: "Sales, Customer Business, Customer IT",
        sla: "1-2 buổi",
        tips: ["Cần chốt người xác nhận nghiệp vụ và người xác nhận kỹ thuật ngay trong workshop"],
      },
      {
        id: "dc-3",
        code: "1.3",
        title: "Định nghĩa AC sơ bộ",
        description: "Viết success criteria/acceptance criteria có thể đo được trước khi đề xuất POC.",
        deliverables: ["AC sơ bộ", "Assumption list"],
        responsible: "Consultant",
        collaborators: "Delivery/Product",
        tips: ["AC mơ hồ là nguyên nhân chính gây tranh cãi nghiệm thu"],
      },
      {
        id: "dc-4",
        code: "1.4",
        title: "Gate 1: POC Go",
        description: "Sales, Consultant và Manager review có nên chuyển sang POC không.",
        deliverables: ["POC Go/No-Go", "POC recommendation"],
        responsible: "Consultant",
        approver: "Sales/Manager",
        tips: ["No-Go sớm tốt hơn build POC sai use case"],
      },
    ],
    pitfalls: [
      "Discovery chỉ nghe Sales mà không gặp đúng stakeholder KH",
      "Chưa có AC đo được đã chuyển sang POC",
    ],
  },
  {
    phase: "POC",
    slug: "poc",
    order: 3,
    title: "POC",
    subtitle: "Chứng minh khả thi với scope giới hạn",
    description:
      "Chứng minh giải pháp khả thi trong phạm vi giới hạn, có QA nội bộ trước khi demo cho KH.",
    raciAccountable: "Consultant Lead",
    raciResponsible: "Consultant + Delivery",
    raciConsulted: "Product, Sales",
    outputs: ["POC Build", "POC Report", "Demo Script", "QA Checklist"],
    objectives: [
      "Chốt scope in/out và AC đo được",
      "Build/config giải pháp trong phạm vi giới hạn",
      "Pass quality review trước khi demo KH",
    ],
    subSteps: [
      {
        id: "poc-1",
        code: "2.1",
        title: "Chốt scope POC",
        description: "Xác định phạm vi POC, dữ liệu, AC, out-of-scope và trách nhiệm KH.",
        deliverables: ["POC Scope", "AC", "Assumptions"],
        responsible: "Consultant",
        collaborators: "Sales, Delivery, Customer",
        tips: ["POC không phải production; phải ghi rõ giới hạn tính năng"],
      },
      {
        id: "poc-2",
        code: "2.2",
        title: "Delivery build/config",
        description: "Delivery hoặc Product build/config POC theo scope đã chốt.",
        deliverables: ["POC Build"],
        responsible: "Delivery",
        collaborators: "Consultant, Product",
        sla: "2-4 tuần",
        tips: ["Không đổi scope trong lúc build nếu chưa có xác nhận"],
      },
      {
        id: "poc-3",
        code: "2.3",
        title: "SIT / QA nội bộ",
        description: "Consultant kiểm tra POC theo rubric chất lượng trước khi lên lịch demo KH.",
        deliverables: ["QA Checklist", "POC score"],
        responsible: "Consultant",
        collaborators: "Delivery",
        approver: "Consultant Lead / Manager",
        tips: ["Không demo khi QA chưa pass"],
      },
      {
        id: "poc-4",
        code: "2.4",
        title: "Demo POC & báo cáo",
        description: "Demo cho KH, trình bày kết quả, gap và đề xuất bước tiếp theo.",
        deliverables: ["POC Report", "Demo recording/notes"],
        responsible: "Consultant",
        collaborators: "Sales, Delivery",
        tips: ["POC report cần có số liệu, không chỉ cảm nhận demo"],
      },
    ],
    pitfalls: [
      "Build POC khi chưa có AC",
      "Demo POC trước khi pass QA nội bộ",
    ],
  },
  {
    phase: "Pilot",
    slug: "pilot",
    order: 4,
    title: "Pilot",
    subtitle: "Tùy chọn: xác thực gần thực tế",
    description:
      "Xác thực giải pháp với dữ liệu, user hoặc quy trình gần thực tế trước khi KH ra quyết định thương mại.",
    raciAccountable: "Delivery/PM",
    raciResponsible: "Delivery",
    raciConsulted: "Consultant, Sales, Customer Users",
    outputs: ["Pilot Result", "UAT Record", "Gap List", "Commercial Recommendation"],
    objectives: [
      "Triển khai pilot với phạm vi rõ và user giới hạn",
      "Ghi nhận kết quả UAT và gap so với production",
      "Chốt commercial next step",
    ],
    subSteps: [
      {
        id: "pl-1",
        code: "3.1",
        title: "Chốt Pilot scope",
        description: "Chi tiết hóa WBS/milestone, user thử nghiệm, dữ liệu và điều kiện pass/fail.",
        deliverables: ["Pilot scope", "WBS", "Pass/Fail criteria"],
        responsible: "Delivery/PM",
        collaborators: "Consultant, Sales, Customer",
        approver: "Customer + Manager",
        tips: ["Pilot không có tiêu chí pass/fail sẽ kéo dài vô hạn"],
      },
      {
        id: "pl-2",
        code: "3.2",
        title: "Triển khai môi trường Pilot",
        description: "Setup môi trường, dữ liệu, user và governance để chạy pilot.",
        deliverables: ["Pilot environment", "User guide"],
        responsible: "Delivery",
        collaborators: "Product, Customer IT",
        tips: ["Mọi thay đổi scope cần ghi bằng văn bản"],
      },
      {
        id: "pl-3",
        code: "3.3",
        title: "UAT / User validation",
        description: "KH test theo tiêu chí đã thống nhất, ghi nhận Pass/Fail và gap.",
        deliverables: ["UAT record", "Gap list"],
        responsible: "Delivery/PM",
        collaborators: "Customer Users, Consultant, Sales",
        approver: "Customer",
        tips: ["Gap Pilot vs production phải được đưa vào proposal/SoW tiếp theo"],
      },
    ],
    pitfalls: [
      "Pilot bị biến thành triển khai production không kiểm soát",
      "Không ghi nhận gap khiến giai đoạn hợp đồng bị tranh cãi",
    ],
  },
  {
    phase: "RFP/RFI & Bid",
    slug: "rfp-rfi-bid",
    order: 5,
    title: "RFP/RFI & Bid",
    subtitle: "Proposal, SoW, hồ sơ thầu, pricing",
    description:
      "Biến kết quả tư vấn/POC/Pilot thành hồ sơ thầu hoặc proposal có tính cạnh tranh và đúng cam kết.",
    raciAccountable: "Sales/AM",
    raciResponsible: "Sales + Consultant",
    raciConsulted: "Delivery, Product, Legal/Finance",
    outputs: ["Proposal", "SoW", "Compliance Matrix", "Bid Submission"],
    objectives: [
      "Quyết định Bid/No-Bid nhanh",
      "Soạn hồ sơ kỹ thuật/thương mại traceable với RFP",
      "Review SoW + pricing trước khi gửi/nộp",
    ],
    subSteps: [
      {
        id: "bid-1",
        code: "4.1",
        title: "Bid / No-Bid",
        description: "Đánh giá có nên tham gia RFP/RFI dựa trên fit, relationship, deal size, timeline.",
        deliverables: ["Bid/No-Bid decision"],
        responsible: "Sales + Consultant",
        approver: "AM/Manager",
        sla: "24-48h",
        tips: ["RFP không phù hợp có thể tiêu tốn 40-80 giờ consultant"],
      },
      {
        id: "bid-2",
        code: "4.2",
        title: "Compliance matrix",
        description: "Map từng yêu cầu RFP sang phần trả lời và trạng thái đáp ứng.",
        deliverables: ["Compliance matrix"],
        responsible: "Consultant",
        collaborators: "Delivery, Product",
        tips: ["Evaluator rất thích hồ sơ có traceability rõ"],
      },
      {
        id: "bid-3",
        code: "4.3",
        title: "Soạn proposal / SoW",
        description: "Viết proposal, narrative kỹ thuật, SoW, assumptions, pricing input.",
        deliverables: ["Proposal draft", "SoW draft"],
        responsible: "Consultant",
        collaborators: "Sales, Delivery, Product",
        tips: ["Dẫn bằng outcome và số liệu POC/Pilot, không chỉ liệt kê tính năng"],
      },
      {
        id: "bid-4",
        code: "4.4",
        title: "Gate 4: Sign-off trước khi gửi",
        description: "Manager/Delivery review SoW, effort, SLA, pricing trước khi gửi KH hoặc nộp thầu.",
        deliverables: ["SoW sign-off", "Pricing approval"],
        responsible: "Sales",
        collaborators: "Consultant, Delivery, Finance",
        approver: "Manager + Delivery Lead",
        tips: ["Không gửi proposal khi Delivery chưa review effort/SLA"],
      },
    ],
    pitfalls: [
      "Copy proposal cũ không map RFP",
      "Cam kết metric vượt năng lực đã chứng minh",
    ],
  },
  {
    phase: "Contract & Handoff",
    slug: "contract-handoff",
    order: 6,
    title: "Contract & Handoff",
    subtitle: "Ký hợp đồng và bàn giao Delivery",
    description:
      "Chốt hợp đồng có thể triển khai được và bàn giao đầy đủ context cho Delivery.",
    raciAccountable: "Sales/AM",
    raciResponsible: "Sales",
    raciConsulted: "Consultant, Delivery, Legal/Finance, Customer",
    outputs: ["Signed Contract", "Technical Appendix", "Handoff Brief", "Kickoff Plan"],
    objectives: [
      "Đàm phán hợp đồng không làm lệch scope/SLA",
      "Sign-off phụ lục kỹ thuật và Delivery readiness",
      "Bàn giao đủ context cho PM/Delivery",
    ],
    subSteps: [
      {
        id: "ct-1",
        code: "5.1",
        title: "Đàm phán hợp đồng",
        description: "Sales lead đàm phán điều khoản thương mại/pháp lý; Consultant review thay đổi kỹ thuật.",
        deliverables: ["Near-final contract"],
        responsible: "Sales",
        collaborators: "Consultant, Legal/Finance, Customer",
        tips: ["Scope/SLA thay đổi khi đàm phán phải được kỹ thuật review lại"],
      },
      {
        id: "ct-2",
        code: "5.2",
        title: "Phụ lục kỹ thuật / SoW sign-off",
        description: "Consultant và Delivery review phụ lục kỹ thuật, AC, milestone, SLA trước khi ký.",
        deliverables: ["Technical appendix", "SoW sign-off"],
        responsible: "Consultant",
        collaborators: "Delivery, Product, Sales",
        approver: "Delivery Lead / Manager",
        tips: ["Phụ lục càng rõ, Delivery càng ít rework và tranh chấp nghiệm thu"],
      },
      {
        id: "ct-3",
        code: "5.3",
        title: "Ký HĐ & handoff Delivery",
        description: "Ký hợp đồng, lưu trữ, bàn giao brief và đặt lịch kickoff với Delivery/KH.",
        deliverables: ["Signed contract", "Handoff brief", "Kickoff plan"],
        responsible: "Sales",
        collaborators: "Consultant, Delivery PM",
        approver: "Customer + Lãnh đạo nội bộ",
        tips: ["Handover miệng khiến Delivery thiếu context"],
      },
    ],
    pitfalls: [
      "Ký khi Delivery chưa xác nhận resource",
      "Handoff thiếu POC/Pilot results, AC và contact list",
    ],
  },
];

export const PHASE_SLUG_MAP: Record<string, Phase> = Object.fromEntries(
  CONSULTING_ROADMAP.map((s) => [s.slug, s.phase]),
) as Record<string, Phase>;

export function getStepBySlug(slug: string): RoadmapStep | undefined {
  return CONSULTING_ROADMAP.find((s) => s.slug === slug);
}

export function getStepByPhase(phase: Phase): RoadmapStep | undefined {
  return CONSULTING_ROADMAP.find((s) => s.phase === phase);
}

export function getSubStep(step: RoadmapStep, subId: string): RoadmapSubStep | undefined {
  return step.subSteps.find((s) => s.id === subId);
}
