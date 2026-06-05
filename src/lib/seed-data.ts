import type { DocItem } from "./types";
import { enrichDocMeta } from "./doc-meta";

const lessonTemplate = `## Bối cảnh dự án
Khách hàng ngân hàng X muốn triển khai trợ lý ảo trả lời tự động cho callcenter.

## Vấn đề gặp phải
- Dữ liệu hội thoại đầu vào nhiễu, nhiều từ địa phương.
- Yêu cầu độ trễ < 800ms gây khó cho mô hình lớn.

## Cách xử lý
1. Bổ sung tập huấn luyện địa phương 5k mẫu.
2. Chuyển sang mô hình quantized + cache câu trả lời thường gặp.

## Bài học rút ra
- Luôn kiểm tra phân phối dữ liệu thật trước khi cam kết SLA.
- PoC nên đo cả p95, không chỉ trung bình.

## Khuyến nghị lần sau
- Yêu cầu khách cung cấp tối thiểu 2 tuần log thật.
- Đưa SLA độ trễ vào hợp đồng dạng dải, không phải một con số.
`;

const standardBody = `## Mục đích
Tài liệu chuẩn mô tả cách tiếp cận tư vấn giải pháp **AI Voice** cho khách hàng BFSI.

## Phạm vi áp dụng
Áp dụng cho mọi cơ hội ở giai đoạn **Tư vấn** và **PoC**.

## Quy trình
1. Khảo sát nghiệp vụ callcenter hiện tại.
2. Xác định 3–5 use case ưu tiên.
3. Dựng demo trên dữ liệu mẫu.
4. Trình bày giải pháp + ước lượng hiệu quả.

## Checklist trước khi gửi khách
- [x] Có sơ đồ kiến trúc
- [x] Có bảng so sánh với hiện trạng
- [x] Có ước lượng ROI sơ bộ
`;

const templateBody = `# Template Effort Estimation — AI Agent

> Điền các phần dưới đây. Đơn vị: **man-day**.

## 1. Phạm vi
- Use case: ...
- Số intent: ...
- Số kênh tích hợp: ...

## 2. Bóc tách công việc

| Hạng mục | Mô tả | MD |
|---|---|---|
| Thiết kế hội thoại | ... | 0 |
| Tích hợp hệ thống | ... | 0 |
| Huấn luyện & tinh chỉnh | ... | 0 |
| Kiểm thử | ... | 0 |
| Contract & Handoff | ... | 0 |

## 3. Rủi ro & buffer
- ...
`;

const playbookBody = `# Playbook PoC Computer Vision cho ENV

## Mục tiêu PoC
Chứng minh khả năng phát hiện vi phạm môi trường qua camera trong **2 tuần**.

## Tuần 1
- D1–D2: Thu thập dữ liệu mẫu tại hiện trường.
- D3–D5: Gán nhãn + huấn luyện mô hình baseline.

## Tuần 2
- D6–D8: Tinh chỉnh, đo precision/recall.
- D9–D10: Dựng dashboard demo.

## Tiêu chí thành công
- Precision ≥ 0.85 trên tập kiểm thử.
- Latency ≤ 1.5s/khung hình.
`;

const mtqtBody = `# MTQT Tư vấn dịch vụ FPT AI

**Mã hiệu:** 07-QT/CLOUD/HDCV/FCI · **Phiên bản:** 1.0 · **Hiệu lực:** 01/07/2025

## Mục đích
Chuẩn hóa quy trình phối hợp giữa các khối phòng ban, đảm bảo tính nhất quán, tối ưu tỷ lệ chuyển đổi cơ hội kinh doanh và kiểm soát rủi ro kỹ thuật.

## Phạm vi
Áp dụng cho toàn bộ dự án cung cấp giải pháp phần mềm AI.

## Sơ đồ quy trình (Swimlane)

![Luồng quy trình MTQT — 6 giai đoạn, Customer · Sales · AI Lab · Delivery · Product](/mtqt/mtqt-quy-trinh.jpeg)

*Sơ đồ gồm 7 swimlane và 6 phase: Intake & Qualify → Discovery → POC → RFP/RFI & Bid → Đàm phán & Contract & Handoff → Contract & Handoff. Các nhánh quyết định (Go/No-Go, Bid/No-bid, Pass/Fail) dẫn tới **Kết thúc hoặc tạm dừng**.*

## 6 giai đoạn

| # | Giai đoạn | Đơn vị A/R chính |
|---|---|---|
| 1 | Intake & Qualify | Sales |
| 2 | Discovery | Sales + AI Lab |
| 3 | Pilot hoặc POC | AI Lab hoặc Delivery |
| 4 | RFP/RFI & Bid | Sales + AI Lab |
| 5 | Đàm phán & Contract & Handoff | Sales + AI Lab |
| 6 | Contract & Handoff | Delivery |

## Phân biệt Demo / POC / Pilot

- **Demo:** Sản phẩm chuẩn FPT, trình diễn tính năng — KH **không** được thao tác.
- **POC:** Bản dùng thử **giới hạn tính năng**, chứng minh tính khả thi.
- **Pilot:** Bản dùng thử **đầy đủ tính năng** như go-live, số lượng user giới hạn.

> Xem roadmap tương tác tại **Quy trình tư vấn** — bấm từng node để xem SLA, RACI và đầu ra từng bước.
`;

/** Dữ liệu mẫu khởi tạo */
const RAW_SEED_DOCS: Omit<DocItem, "category" | "fileFormat">[] = [
  {
    id: "mtqt",
    slug: "mtqt-tu-van-ai-fpt",
    title: "MTQT Tư vấn dịch vụ FPT AI (07-QT/CLOUD/HDCV/FCI)",
    summary:
      "Quy trình chuẩn 6 giai đoạn: Tiếp cận → Discovery → POC → RFP/RFI & Bid → Contract & Handoff → Contract & Handoff.",
    body: mtqtBody,
    type: "Chuẩn",
    status: "Đã duyệt",
    verticals: ["Dùng chung"],
    products: ["Voice", "AI Agent", "CV"],
    phases: ["Intake & Qualify", "Discovery", "POC", "RFP/RFI & Bid", "Contract & Handoff", "Contract & Handoff"],
    owner: "FCI AI Lab",
    updatedAt: "2026-01-27",
    lastReviewedAt: "2026-01-27",
    attachments: [
      {
        id: "mtqt-flow",
        kind: "link",
        fileName: "Sơ đồ quy trình (ảnh swimlane)",
        fileType: "jpeg",
        url: "/mtqt/mtqt-quy-trinh.jpeg",
      },
    ],
  },
  {
    id: "1",
    slug: "chuan-tu-van-voice-bfsi",
    title: "Chuẩn tư vấn giải pháp Voice cho BFSI",
    summary: "Quy trình tư vấn chuẩn cho khách ngân hàng/bảo hiểm khi triển khai AI Voice.",
    body: standardBody,
    type: "Chuẩn",
    status: "Đã duyệt",
    verticals: ["BFSI"],
    products: ["Voice"],
    phases: ["Discovery", "POC"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-05-20",
    lastReviewedAt: "2026-05-22",
    attachments: [
      {
        id: "a1",
        kind: "link",
        fileName: "kien-truc-voice-bfsi.pptx",
        fileType: "pptx",
        url: "https://docs.google.com/presentation/",
      },
    ],
  },
  {
    id: "2",
    slug: "template-effort-ai-agent",
    title: "Template Effort Estimation cho AI Agent",
    summary: "Bảng bóc tách công việc chuẩn cho dự án AI Agent, dùng ở giai đoạn báo giá.",
    body: templateBody,
    type: "Template",
    status: "Đã duyệt",
    verticals: ["Dùng chung"],
    products: ["AI Agent"],
    phases: ["Discovery", "RFP/RFI & Bid"],
    owner: "Trần Quốc Hùng",
    updatedAt: "2026-04-12",
    lastReviewedAt: "2026-04-15",
    attachments: [
      {
        id: "a2",
        kind: "link",
        fileName: "effort-ai-agent.xlsx",
        fileType: "xlsx",
        url: "https://docs.google.com/spreadsheets/",
      },
    ],
  },
  {
    id: "3",
    slug: "kinh-nghiem-voice-callcenter-bank-x",
    title: "Kinh nghiệm triển khai Voice cho Bank X",
    summary: "Bài học từ dự án Voice callcenter ngân hàng X: dữ liệu nhiễu và SLA độ trễ.",
    body: lessonTemplate,
    type: "Kinh nghiệm",
    status: "Đã duyệt",
    verticals: ["BFSI"],
    products: ["Voice"],
    phases: ["POC"],
    owner: "Lê Thị Hồng",
    updatedAt: "2026-05-30",
    lastReviewedAt: "2026-06-01",
    attachments: [],
  },
  {
    id: "4",
    slug: "playbook-poc-cv-env",
    title: "Playbook PoC Computer Vision cho ENV",
    summary: "Quy trình 2 tuần dựng PoC CV phát hiện vi phạm môi trường.",
    body: playbookBody,
    type: "Playbook",
    status: "Đã duyệt",
    verticals: ["ENV"],
    products: ["CV"],
    phases: ["POC"],
    owner: "Phạm Văn Đức",
    updatedAt: "2026-03-18",
    lastReviewedAt: "2026-03-20",
    attachments: [
      {
        id: "a3",
        kind: "link",
        fileName: "checklist-poc-cv.pdf",
        fileType: "pdf",
        url: "https://drive.google.com/",
      },
    ],
  },
  {
    id: "5",
    slug: "template-de-xuat-tu-van-gov",
    title: "Template đề xuất tư vấn cho khối Chính phủ",
    summary: "Mẫu slide đề xuất tư vấn AI cho khách hàng GOV, có sẵn cấu trúc 12 slide.",
    body: "# Template đề xuất tư vấn GOV\n\nMở file đính kèm hoặc link bên dưới để chỉnh sửa.",
    type: "Template",
    status: "Đã duyệt",
    verticals: ["GOV"],
    products: ["AI Agent", "CV"],
    phases: ["Discovery"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-02-10",
    lastReviewedAt: "2026-02-12",
    attachments: [
      {
        id: "a4",
        kind: "link",
        fileName: "de-xuat-tu-van-gov.pptx",
        fileType: "pptx",
        url: "https://docs.google.com/presentation/",
      },
    ],
  },
  {
    id: "6",
    slug: "chuan-checklist-thau-ai-agent",
    title: "Checklist hồ sơ thầu AI Agent",
    summary: "Danh mục tài liệu bắt buộc khi nộp thầu dự án AI Agent.",
    body: "# Checklist hồ sơ thầu\n\n- [ ] Hồ sơ năng lực\n- [ ] Phương án kỹ thuật\n- [ ] Báo giá chi tiết\n- [ ] Kế hoạch triển khai\n- [ ] CV nhân sự chủ chốt\n",
    type: "Chuẩn",
    status: "Đã duyệt",
    verticals: ["Dùng chung"],
    products: ["AI Agent"],
    phases: ["RFP/RFI & Bid"],
    owner: "Trần Quốc Hùng",
    updatedAt: "2026-05-05",
    lastReviewedAt: "2026-05-08",
    attachments: [],
  },
  {
    id: "7",
    slug: "kinh-nghiem-cv-nha-may-env",
    title: "Kinh nghiệm dự án CV giám sát nhà máy ENV",
    summary: "Bài học khi triển khai CV ở môi trường ánh sáng yếu và bụi.",
    body: lessonTemplate,
    type: "Kinh nghiệm",
    status: "Đã review",
    verticals: ["ENV"],
    products: ["CV"],
    phases: ["POC", "RFP/RFI & Bid"],
    owner: "Phạm Văn Đức",
    updatedAt: "2026-05-28",
    lastReviewedAt: null,
    attachments: [],
  },
  {
    id: "8",
    slug: "playbook-effort-voice",
    title: "Playbook ước lượng effort cho Voice",
    summary: "Cách quy đổi nhanh từ số intent và kênh sang man-day cho dự án Voice.",
    body: playbookBody,
    type: "Playbook",
    status: "Đã duyệt",
    verticals: ["Dùng chung"],
    products: ["Voice"],
    phases: ["Discovery"],
    owner: "Lê Thị Hồng",
    updatedAt: "2026-04-25",
    lastReviewedAt: "2026-04-26",
    attachments: [],
  },
  {
    id: "9",
    slug: "template-bao-cao-poc",
    title: "Template báo cáo kết quả PoC",
    summary: "Mẫu báo cáo PoC chuẩn, dùng được cho cả 3 dòng sản phẩm.",
    body: templateBody,
    type: "Template",
    status: "Đã duyệt",
    verticals: ["Dùng chung"],
    products: ["Voice", "AI Agent", "CV"],
    phases: ["POC"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-01-15",
    lastReviewedAt: "2026-01-18",
    attachments: [
      {
        id: "a5",
        kind: "link",
        fileName: "bao-cao-poc.docx",
        fileType: "docx",
        url: "https://docs.google.com/document/",
      },
    ],
  },
  {
    id: "10",
    slug: "kinh-nghiem-thau-gov-ai-agent",
    title: "Kinh nghiệm đấu thầu AI Agent cho GOV",
    summary: "Lưu ý về tiêu chí kỹ thuật và năng lực khi dự thầu các dự án GOV.",
    body: lessonTemplate,
    type: "Kinh nghiệm",
    status: "Nháp",
    verticals: ["GOV"],
    products: ["AI Agent"],
    phases: ["RFP/RFI & Bid"],
    owner: "Trần Quốc Hùng",
    updatedAt: "2026-06-02",
    lastReviewedAt: null,
    attachments: [],
  },
  {
    id: "11",
    slug: "chuan-kien-truc-ai-agent",
    title: "Chuẩn kiến trúc tham chiếu cho AI Agent",
    summary: "Sơ đồ kiến trúc tham chiếu chuẩn dùng cho mọi dự án AI Agent.",
    body: standardBody,
    type: "Chuẩn",
    status: "Đã duyệt",
    verticals: ["Dùng chung"],
    products: ["AI Agent"],
    phases: ["Discovery", "POC"],
    owner: "Lê Thị Hồng",
    updatedAt: "2026-03-30",
    lastReviewedAt: "2026-04-01",
    attachments: [
      {
        id: "a6",
        kind: "link",
        fileName: "kien-truc-agent.pdf",
        fileType: "pdf",
        url: "https://drive.google.com/",
      },
    ],
  },
  {
    id: "12",
    slug: "playbook-tu-van-bfsi",
    title: "Playbook tiếp cận khách hàng BFSI",
    summary: "Hướng dẫn từng bước cách mở cơ hội tư vấn AI cho ngân hàng & bảo hiểm.",
    body: playbookBody,
    type: "Playbook",
    status: "Đã duyệt",
    verticals: ["BFSI"],
    products: ["Voice", "AI Agent"],
    phases: ["Intake & Qualify", "Discovery"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-05-10",
    lastReviewedAt: "2026-05-12",
    attachments: [],
  },
];

export const SEED_DOCS: DocItem[] = RAW_SEED_DOCS.map((doc) => enrichDocMeta(doc as DocItem));

