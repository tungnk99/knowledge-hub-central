import type { Vertical, Product, Phase, DocType, DocStatus } from "./taxonomy";

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  sizeKb: number;
}

export interface DocItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  type: DocType;
  status: DocStatus;
  verticals: Vertical[];
  products: Product[];
  phases: Phase[];
  owner: string;
  updatedAt: string;
  lastReviewedAt: string | null;
  attachments: Attachment[];
}

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
| Triển khai | ... | 0 |

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

export const MOCK_DOCS: DocItem[] = [
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
    phases: ["Tư vấn", "PoC"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-05-20",
    lastReviewedAt: "2026-05-22",
    attachments: [
      { id: "a1", fileName: "kien-truc-voice-bfsi.pptx", fileType: "pptx", sizeKb: 2400 },
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
    phases: ["Effort Estimation", "Thầu"],
    owner: "Trần Quốc Hùng",
    updatedAt: "2026-04-12",
    lastReviewedAt: "2026-04-15",
    attachments: [
      { id: "a2", fileName: "effort-ai-agent.xlsx", fileType: "xlsx", sizeKb: 180 },
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
    phases: ["PoC"],
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
    phases: ["PoC"],
    owner: "Phạm Văn Đức",
    updatedAt: "2026-03-18",
    lastReviewedAt: "2026-03-20",
    attachments: [
      { id: "a3", fileName: "checklist-poc-cv.pdf", fileType: "pdf", sizeKb: 540 },
    ],
  },
  {
    id: "5",
    slug: "template-de-xuat-tu-van-gov",
    title: "Template đề xuất tư vấn cho khối Chính phủ",
    summary: "Mẫu slide đề xuất tư vấn AI cho khách hàng GOV, có sẵn cấu trúc 12 slide.",
    body: "# Template đề xuất tư vấn GOV\n\nMở file đính kèm để chỉnh sửa.",
    type: "Template",
    status: "Đã duyệt",
    verticals: ["GOV"],
    products: ["AI Agent", "CV"],
    phases: ["Tư vấn"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-02-10",
    lastReviewedAt: "2026-02-12",
    attachments: [
      { id: "a4", fileName: "de-xuat-tu-van-gov.pptx", fileType: "pptx", sizeKb: 3200 },
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
    phases: ["Thầu"],
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
    phases: ["PoC", "Thầu"],
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
    phases: ["Effort Estimation"],
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
    phases: ["PoC"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-01-15",
    lastReviewedAt: "2026-01-18",
    attachments: [
      { id: "a5", fileName: "bao-cao-poc.docx", fileType: "docx", sizeKb: 220 },
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
    phases: ["Thầu"],
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
    phases: ["Tư vấn", "PoC"],
    owner: "Lê Thị Hồng",
    updatedAt: "2026-03-30",
    lastReviewedAt: "2026-04-01",
    attachments: [
      { id: "a6", fileName: "kien-truc-agent.pdf", fileType: "pdf", sizeKb: 1100 },
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
    phases: ["Tư vấn"],
    owner: "Nguyễn Minh Anh",
    updatedAt: "2026-05-10",
    lastReviewedAt: "2026-05-12",
    attachments: [],
  },
];
