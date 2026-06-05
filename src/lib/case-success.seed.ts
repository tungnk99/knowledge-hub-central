import type { CaseSuccess } from "./case-success.types";

export const SEED_CASES: CaseSuccess[] = [
  {
    id: "case_seed_bank_x_voice",
    opportunityCode: "OPP-2026-BFSI-VOICE-001",
    opportunityName: "AI Voice Agent Call Center Bank X",
    customerName: "Bank X",
    vertical: "BFSI",
    products: ["Voice", "AI Agent"],
    phase: "POC",
    owner: "Nguyễn Minh Anh",
    visibility: "Chia sẻ rộng",
    context:
      "Bank X cần giảm tải tổng đài giờ cao điểm cho nhóm truy vấn số dư, trạng thái khoản vay và nhắc lịch thanh toán. Sales đã có sponsor cấp phòng vận hành nhưng IT còn thận trọng về dữ liệu thật.",
    challenge:
      "Log cuộc gọi nhiễu, nhiều giọng địa phương; KH yêu cầu latency thấp nhưng chưa có baseline; stakeholder nghiệp vụ muốn demo nhanh trong khi IT cần kiểm soát dữ liệu.",
    solution:
      "Consultant tổ chức mini-discovery với nghiệp vụ + IT, chốt 5 intent ưu tiên, dùng dữ liệu đã ẩn danh cho POC. Delivery build Voice Agent với cache câu trả lời thường gặp, Consultant chuẩn bị demo script theo pain point vận hành và QA bằng rubric trước khi demo.",
    outcome:
      "POC pass 92% acceptance criteria, demo được sponsor xác nhận tiếp tục sang proposal. KH đồng ý dùng số liệu POC làm bằng chứng trong business case nội bộ.",
    metrics: [
      "92% AC pass trong POC",
      "Giảm 38% thời gian xử lý nhóm câu hỏi lặp lại trong demo script",
      "Latency p95 đạt 1.1s trên tập test đã thống nhất",
    ],
    shareableKnowledge:
      "Khi tư vấn Voice Agent cho BFSI, đừng bắt đầu bằng công nghệ nhận diện giọng nói. Hãy bắt đầu từ nhóm intent có tần suất cao, ít rủi ro pháp lý và có log đủ sạch. Mini-discovery với IT là bắt buộc trước khi cam kết latency hoặc phạm vi dữ liệu.",
    reusableLessons: [
      "Luôn yêu cầu log thật tối thiểu 1-2 tuần hoặc tập dữ liệu đã ẩn danh trước khi cam kết SLA.",
      "Với BFSI, kéo IT vào Discovery sớm giúp tránh blocker bảo mật ở cuối POC.",
      "Demo nên kể câu chuyện pain -> giải pháp -> metric, không chỉ cho bot trả lời.",
    ],
    reuseGuidance:
      "Dùng case này khi gặp Opp BFSI có bài toán call center, voicebot hoặc AI Agent xử lý câu hỏi lặp lại. Có thể tái sử dụng demo script, checklist dữ liệu và cách trình bày business case.",
    relatedDocs: [
      {
        id: "doc_voice_bfsi",
        title: "Chuẩn tư vấn giải pháp Voice cho BFSI",
        url: "/tai-lieu/chuan-tu-van-voice-bfsi",
      },
      {
        id: "doc_poc_report",
        title: "Template báo cáo kết quả POC",
        url: "/tai-lieu/template-bao-cao-poc",
      },
    ],
    references: [
      {
        id: "ref_seed_proposal",
        title: "Proposal đã thắng - Bank X",
        url: "https://docs.google.com/presentation/",
      },
      {
        id: "ref_seed_metric",
        title: "POC metrics dashboard",
        url: "https://docs.google.com/spreadsheets/",
      },
    ],
    tags: ["BFSI", "Voice", "POC pass", "Call Center", "Latency"],
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
];
