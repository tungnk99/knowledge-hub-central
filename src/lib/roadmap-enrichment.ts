import type { RoadmapStep, RoadmapSubStep } from "./consulting-roadmap";
import type { PhaseOverride, SubStepOverride } from "./roadmap-overrides.types";

export type RaciTag = "PIC" | "A" | "R" | "C" | "I";

export interface RoleParticipant {
  unit: string;
  raci: RaciTag;
  /** Việc cụ thể đơn vị này làm */
  duties: string[];
  /** Hỗ trợ / input gì cho PIC */
  support?: string;
}

export interface StepEnrichment {
  pic: string;
  participants: RoleParticipant[];
  meaning?: string;
  inputs?: string[];
  coordination: string;
  taskSteps: string[];
  /** Kinh nghiệm đi trước — bổ sung hoặc thay tips */
  lessons: string[];
  exitCriteria?: string[];
  risks?: string[];
  decisionOwner?: string;
  customerExperiencePrompt?: string[];
  /** Slug tài liệu ưu tiên hiển thị */
  docSlugs?: string[];
}

export interface PhaseEnrichment {
  meaning: string;
  inputs: string[];
  outputsMeaning: string[];
  standardSteps: string[];
  collaboration: string;
  generalLessons: string[];
  customerExperiencePrompt: string[];
  exitCriteria: string[];
  decisionOwner: string;
  risks: string[];
}

export const PHASE_ENRICHMENT: Record<string, PhaseEnrichment> = {
  "intake-qualify": {
    meaning:
      "Giai đoạn sàng lọc và định hình cơ hội. Mục tiêu không phải bán ngay, mà là hiểu bài toán, xác định đúng người liên quan và quyết định có nên đầu tư thời gian tư vấn hay không.",
    inputs: [
      "Danh sách khách hàng/cơ hội từ Sales hoặc AM",
      "Bối cảnh ngành, quy mô, pain point và timeline mong muốn của KH",
      "Tài sản demo/slide/survey chuẩn từ AI Lab",
      "Thông tin stakeholder: nghiệp vụ, IT, mua sắm, người quyết định",
    ],
    outputsMeaning: [
      "Survey và ghi chú tiếp cận là input chính cho Consultant đánh giá ở giai đoạn tư vấn",
      "Ticket tư vấn giúp chuẩn hóa handoff Sales -> AI Lab, tránh trao đổi miệng thiếu context",
    ],
    standardSteps: [
      "Sales chuẩn bị profile KH và mục tiêu buổi gặp",
      "Demo tiêu chuẩn, ghi nhận pain point và stakeholder",
      "Gửi survey, theo dõi KH phản hồi trong 3-5 ngày",
      "Tạo ticket tư vấn kèm đầy đủ survey, ghi chú và mức độ ưu tiên",
    ],
    collaboration:
      "Sales là PIC và đầu mối với KH. AI Lab cung cấp tài sản chuẩn và chỉ tham gia khi KH hỏi sâu kỹ thuật. Không để nhiều người cùng cam kết với KH ở buổi đầu.",
    generalLessons: [
      "Đừng biến demo đầu tiên thành POC. Demo chỉ để KH hiểu năng lực và mở nhu cầu.",
      "Nếu thiếu stakeholder IT/nghiệp vụ ngay từ đầu, các bước sau thường phải quay lại hỏi lại.",
      "Survey càng rõ thì Consultant đánh giá càng nhanh, giảm vòng hỏi đáp nội bộ.",
    ],
    customerExperiencePrompt: [
      "KH nào phản hồi survey tốt/kém, lý do là gì?",
      "Thông điệp demo nào khiến KH quan tâm nhất?",
      "Stakeholder nào thật sự có quyền quyết định hoặc ảnh hưởng mạnh?",
    ],
    exitCriteria: [
      "Có ticket tư vấn được tạo và assign đúng người",
      "Có survey hoặc ghi chú thay thế đủ để đánh giá sơ bộ",
      "Xác định được use case ưu tiên và người liên hệ chính phía KH",
    ],
    decisionOwner: "Manager duyệt nguồn lực; Sales/AM quyết định có nurture thêm nếu No-Go",
    risks: [
      "Cam kết giá/scope quá sớm khi chưa có đánh giá kỹ thuật",
      "Ticket thiếu thông tin khiến AI Lab không thể đánh giá trong SLA",
    ],
  },
  discovery: {
    meaning:
      "Giai đoạn chuyển nhu cầu mơ hồ thành use case, dữ liệu, stakeholder và tiêu chí thành công có thể đo được trước khi quyết định POC.",
    inputs: [
      "Ticket, survey, ghi chú demo từ giai đoạn tiếp cận",
      "Use case ưu tiên, dữ liệu KH có thể cung cấp, ràng buộc tích hợp/bảo mật",
      "Template proposal, slide, demo, benchmark effort và báo giá tham chiếu",
      "Ý kiến Solution, Project, Product nếu đề bài có rủi ro kỹ thuật",
    ],
    outputsMeaning: [
      "Discovery Note là căn cứ để quyết định POC Go/No-Go",
      "Use Case Map và AC sơ bộ là baseline cho POC, proposal và SoW",
    ],
    standardSteps: [
      "Workshop với KH để làm rõ nghiệp vụ, dữ liệu, tích hợp và tiêu chí thành công",
      "Định nghĩa use case, dữ liệu, stakeholder và AC sơ bộ",
      "Review POC Go/No-Go với Sales/Manager",
    ],
    collaboration:
      "Consultant là PIC nội dung kỹ thuật, Sales là PIC quan hệ và thương mại. Project/Solution/Product tham gia review khi có rủi ro triển khai, kiến trúc hoặc roadmap sản phẩm.",
    generalLessons: [
      "AC phải đo được bằng số liệu, dữ liệu, môi trường test và ngưỡng pass/fail.",
      "Không báo giá khi scope và giả định dữ liệu còn mơ hồ.",
      "Workshop phải có cả nghiệp vụ và IT, nếu không phương án dễ thiếu phần tích hợp/vận hành.",
    ],
    customerExperiencePrompt: [
      "KH phản biện phần nào của proposal nhiều nhất?",
      "Giả định nào từng bị sai khi đi vào Pilot/POC?",
      "Báo giá/timeline nào đã được KH chấp nhận tốt và vì sao?",
    ],
    exitCriteria: [
      "Có quyết định Go/No-Go nội bộ",
      "Proposal/báo giá đã gửi KH và được review kỹ thuật",
      "KH xác nhận Yes/No cho Pilot/POC hoặc bước tiếp theo",
    ],
    decisionOwner: "Consultant Lead đề xuất; Sales/Manager chốt POC Go/No-Go",
    risks: [
      "Scope in/out không rõ làm phát sinh tranh cãi khi nghiệm thu",
      "Custom demo quá sớm làm tốn effort nhưng chưa chắc tạo deal",
    ],
  },
  poc: {
    meaning:
      "Giai đoạn chứng minh giải pháp trong điều kiện kiểm soát và scope giới hạn. Mục tiêu là xác thực tính khả thi, đo kết quả theo AC và tạo bằng chứng cho proposal/thầu/hợp đồng.",
    inputs: [
      "Discovery Note, POC Scope và AC đã thống nhất",
      "Dữ liệu mẫu hoặc dữ liệu thật được KH cho phép dùng",
      "Dữ liệu mẫu hoặc dữ liệu thật được KH cho phép dùng",
      "Nguồn lực AI Lab/Delivery/Product đã được xác nhận",
    ],
    outputsMeaning: [
      "POC Build và POC Report là bằng chứng kỹ thuật cho proposal/RFP/SoW",
      "QA Checklist giúp quyết định có demo KH hay cần rework",
    ],
    standardSteps: [
      "Chốt scope in/out, dữ liệu và AC",
      "Delivery/Product build hoặc config theo scope",
      "Consultant chạy SIT/QA nội bộ",
      "Demo KH và lập POC Report",
    ],
    collaboration:
      "Consultant sở hữu intent và chất lượng POC. Delivery/Product build/config. Sales quản lý kỳ vọng KH và lịch demo.",
    generalLessons: [
      "QA phải pass trước khi mời KH xem demo, nếu không mất niềm tin rất nhanh.",
      "POC phải được phân biệt rõ với Pilot/production.",
      "Mọi thay đổi AC trong quá trình làm phải có xác nhận bằng email/biên bản.",
    ],
    customerExperiencePrompt: [
      "Dữ liệu KH có vấn đề gì khi đưa vào test?",
      "AC nào quá khó/quá dễ so với thực tế?",
      "KH đánh giá demo/UAT dựa trên tiêu chí chính thức hay cảm nhận?",
    ],
    exitCriteria: [
      "Có biên bản UAT hoặc email xác nhận Pass/Fail",
      "Có báo cáo Pilot/POC kèm gap so với production",
      "Sales và AI Lab thống nhất bước tiếp theo: thầu, ký HĐ, làm lại hoặc dừng",
    ],
    decisionOwner: "Consultant Lead/Manager sign-off chất lượng trước demo KH",
    risks: [
      "Build khi chưa có văn bản xác nhận dẫn đến scope creep",
      "Dữ liệu không đại diện khiến kết quả POC không thuyết phục khi thầu",
    ],
  },
  pilot: {
    meaning:
      "Giai đoạn tùy chọn để xác thực giải pháp với dữ liệu, user hoặc quy trình gần thực tế trước khi KH ra quyết định thương mại.",
    inputs: [
      "Kết quả POC và gap đã ghi nhận",
      "Pilot scope/full AC, nhóm user thử nghiệm và dữ liệu thật",
      "Văn bản xác nhận Pilot và governance dự án",
    ],
    outputsMeaning: [
      "Pilot Result và UAT Record là bằng chứng thương mại/kỹ thuật cho bước ký hoặc thầu",
      "Gap List giúp làm rõ phần cần đưa vào SoW/production",
    ],
    standardSteps: [
      "Chốt Pilot scope, WBS và pass/fail criteria",
      "Setup môi trường, dữ liệu và user thử nghiệm",
      "Chạy UAT/user validation",
      "Ghi gap và commercial recommendation",
    ],
    collaboration:
      "Delivery/PM là PIC. Consultant bảo toàn intent POC và giải thích AC. Sales quản lý kỳ vọng và bước thương mại tiếp theo.",
    generalLessons: [
      "Pilot không có tiêu chí pass/fail sẽ kéo dài vô hạn.",
      "Mọi thay đổi scope cần ghi bằng văn bản.",
      "Gap Pilot vs production phải được phản ánh vào SoW tiếp theo.",
    ],
    customerExperiencePrompt: [
      "User thật phản hồi điểm nào khác với giả định POC?",
      "Gap nào phải đưa vào proposal/SoW?",
      "Điều kiện vận hành nào cần cảnh báo sớm?",
    ],
    exitCriteria: [
      "Có UAT Record hoặc xác nhận Pass/Fail",
      "Có Gap List và recommendation bước tiếp theo",
      "KH và team nội bộ thống nhất đi tiếp/dừng/rework",
    ],
    decisionOwner: "Customer + Manager chốt có đi tiếp RFP/HĐ hay cần điều chỉnh scope",
    risks: [
      "Pilot bị biến thành production không kiểm soát",
      "Không ghi nhận gap khiến hợp đồng bị tranh cãi",
    ],
  },
  "rfp-rfi-bid": {
    meaning:
      "Giai đoạn biến kết quả tư vấn/POC/Pilot thành hồ sơ thầu hoặc proposal có tính cạnh tranh, đúng RFP và không vượt năng lực delivery.",
    inputs: [
      "RFP/RFI hoặc yêu cầu proposal từ KH",
      "Kết quả POC/Pilot, số liệu, case study tương tự",
      "Năng lực Delivery/Product, CV, chứng chỉ, giá tham chiếu",
    ],
    outputsMeaning: [
      "Proposal/SoW là cam kết chính thức trước khi ký hoặc nộp thầu",
      "Compliance Matrix giúp evaluator và nội bộ kiểm tra traceability",
    ],
    standardSteps: [
      "Bid/No-Bid trong 24-48h",
      "Phân tích RFP và lập compliance matrix",
      "Soạn technical proposal/SoW/pricing input",
      "Manager + Delivery review SoW, SLA, effort, pricing trước khi gửi",
    ],
    collaboration:
      "Sales điều phối deadline và thương mại. Consultant sở hữu technical proposal/SoW. Delivery/Product review effort/SLA. Finance/Legal review giá và điều khoản khi cần.",
    generalLessons: [
      "Đừng copy proposal cũ mà không map RFP.",
      "Metric cam kết không được vượt điều đã chứng minh hoặc năng lực delivery.",
      "Luôn có buffer review trước khi nộp/gửi.",
    ],
    customerExperiencePrompt: [
      "Tiêu chí RFP nào làm mình yếu?",
      "Câu trả lời/kiến trúc nào được đánh giá tốt?",
      "Lý do thắng/thua theo feedback KH/BTC là gì?",
    ],
    exitCriteria: [
      "Proposal/SoW đã được review và sign-off",
      "Hồ sơ đã gửi/nộp đúng hạn",
      "Q&A/feedback được log để học lại",
    ],
    decisionOwner: "AM/Manager chốt Bid/No-Bid và duyệt SoW/pricing trước khi gửi",
    risks: [
      "Copy hồ sơ cũ không khớp RFP",
      "Gửi proposal khi Delivery chưa review effort/SLA",
    ],
  },
  "contract-handoff": {
    meaning:
      "Giai đoạn chốt hợp đồng có thể triển khai được và bàn giao đầy đủ context cho Delivery.",
    inputs: [
      "Proposal/SoW đã chốt",
      "Điều khoản thương mại/pháp lý",
      "AC/SLA/milestone, kết quả POC/Pilot và contact list KH",
      "Delivery readiness/resource confirmation",
    ],
    outputsMeaning: [
      "Signed Contract là baseline pháp lý",
      "Handoff Brief giúp Delivery hiểu đầy đủ cam kết với KH",
    ],
    standardSteps: [
      "Đàm phán hợp đồng và điều khoản",
      "Consultant/Delivery review phụ lục kỹ thuật và SoW",
      "Ký hợp đồng và lưu trữ",
      "Bàn giao handoff package cho Delivery PM",
    ],
    collaboration:
      "Sales lead đàm phán và ký. Consultant kiểm soát phụ lục kỹ thuật. Delivery xác nhận resource và nhận handoff. Legal/Finance tham gia nếu điều khoản rủi ro.",
    generalLessons: [
      "Scope/SLA thay đổi khi đàm phán phải được kỹ thuật review lại.",
      "Handover miệng khiến Delivery thiếu context.",
      "Ký khi Delivery chưa xác nhận resource là rủi ro lớn.",
    ],
    customerExperiencePrompt: [
      "Điều khoản nào KH hay đàm phán nhất?",
      "SLA/AC nào từng gây tranh chấp?",
      "Checklist handoff nào giúp Delivery vào việc nhanh nhất?",
    ],
    exitCriteria: [
      "Hợp đồng/phụ lục đã ký và lưu đúng nơi",
      "Delivery nhận đủ handoff package",
      "Có lịch kickoff với KH/Delivery",
    ],
    decisionOwner: "Sales/AM điều phối ký; Delivery Lead/Manager sign-off phụ lục kỹ thuật",
    risks: [
      "Delivery thiếu context tư vấn/Pilot nên hiểu sai cam kết",
      "Không cập nhật lesson learned khiến lỗi lặp lại ở deal sau",
    ],
  },
};

export const STEP_ENRICHMENT: Record<string, StepEnrichment> = {
  "tc-1": {
    pic: "Sales (AM phụ trách)",
    meaning:
      "Mở cơ hội và kiểm tra nhanh mức độ phù hợp của nhu cầu KH với năng lực AI hiện có trước khi đầu tư tư vấn sâu.",
    inputs: ["Danh sách KH/cơ hội", "Slide/demo chuẩn", "Survey nhu cầu", "Thông tin ngành và stakeholder"],
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Tiếp cận KH", "Thuyết trình giải pháp AI", "Trình diễn demo tiêu chuẩn", "Gửi survey"] },
      { unit: "Customer", raci: "C", duties: ["Cung cấp nhu cầu ban đầu", "Tham dự demo"], support: "Phản hồi use case ưu tiên" },
      { unit: "AI Lab - Consultant", raci: "I", duties: ["Tư vấn kỹ thuật nếu Sales yêu cầu"], support: "Slide/demo chuẩn, checklist survey" },
    ],
    coordination:
      "Sales chủ trì buổi tiếp cận, dùng tài sản chuẩn (slide, demo, survey) từ AI Lab. Nếu KH hỏi sâu kỹ thuật, Sales ping Consultant hỗ trợ trong 24h — không cam kết scope/ giá tại buổi này.",
    taskSteps: [
      "Chuẩn bị profile KH và lịch sử cơ hội",
      "Demo tiêu chuẩn (video hoặc trình diễn trực tiếp — KH không thao tác)",
      "Ghi nhận pain point, stakeholder, timeline mong muốn",
      "Gửi survey và thu hồi trong 3–5 ngày",
    ],
    lessons: [
      "Demo ≠ POC — không cam kết tính năng/ SLA tại buổi đầu",
      "Survey thiếu thông tin → chậm cả giai đoạn tư vấn",
    ],
    exitCriteria: ["KH hiểu năng lực demo chuẩn", "Có pain point và stakeholder chính", "Survey đã gửi và có lịch follow up"],
    risks: ["KH hiểu nhầm demo là POC", "Sales cam kết scope/giá quá sớm"],
    decisionOwner: "Sales/AM",
    customerExperiencePrompt: ["Thông điệp demo nào làm KH quan tâm nhất?", "KH có phản hồi survey đúng hạn không, vì sao?"],
    docSlugs: ["playbook-tu-van-bfsi", "mtqt-tu-van-ai-fpt"],
  },
  "tc-2": {
    pic: "Sales",
    meaning:
      "Chuẩn hóa việc bàn giao nhu cầu từ Sales sang AI Lab để Consultant có đủ context đánh giá trong SLA.",
    inputs: ["Kết quả survey", "Ghi chú buổi demo", "Thông tin KH/ngành/sản phẩm quan tâm", "Mức độ ưu tiên cơ hội"],
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Tạo ticket tư vấn trên hệ thống", "Đính kèm kết quả survey"] },
      { unit: "AI Lab - Consultant", raci: "R", duties: ["Tiếp nhận ticket", "Đánh giá sơ bộ trong SLA"] },
    ],
    coordination:
      "Sales tạo ticket ngay sau buổi tiếp cận, tag đủ AM, ngành, sản phẩm quan tâm. Consultant nhận ticket và phản hồi nhận việc trong 1 ngày làm việc.",
    taskSteps: [
      "Điền ticket: KH, ngành, sản phẩm (Voice/Agent/CV), mức độ ưu tiên",
      "Upload survey + ghi chú buổi demo",
      "Assign Consultant phụ trách",
    ],
    lessons: ["Ticket mơ hồ → Consultant phải hỏi lại Sales, mất 1–2 ngày"],
    exitCriteria: ["Ticket có đủ survey/ghi chú", "Consultant được assign", "Có SLA phản hồi rõ ràng"],
    risks: ["Thiếu file survey", "Không ghi rõ ngành/use case ưu tiên"],
    decisionOwner: "Sales",
    customerExperiencePrompt: ["Loại thông tin nào trong ticket giúp Consultant đánh giá nhanh nhất?"],
    docSlugs: ["mtqt-tu-van-ai-fpt"],
  },
  "tv-1": {
    pic: "AI Lab - Consultant",
    meaning:
      "Xác định đề bài có khả thi, có đáng đầu tư tư vấn và cần kéo thêm năng lực nào trước khi gặp sâu với KH.",
    inputs: ["Ticket tư vấn", "Survey", "Ghi chú Sales", "Tài liệu ngành/KH nếu có"],
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Đánh giá đề bài", "Xác định rủi ro & năng lực cần"] },
      { unit: "AI Lab - Project", raci: "C", duties: ["Ước lượng effort sơ bộ"], support: "Input triển khai thực tế" },
      { unit: "AI Lab - Solution", raci: "C", duties: ["Tư vấn kiến trúc"], support: "Sơ đồ giải pháp tham chiếu" },
      { unit: "Product", raci: "C", duties: ["Xác nhận tính khả dụng sản phẩm"], support: "Roadmap tính năng" },
      { unit: "Sales", raci: "I", duties: ["Cung cấp context thương mại"] },
    ],
    coordination:
      "Consultant họp nội bộ 30–60 phút với Project/Solution/Product khi cần. Kết quả: ghi chú đánh giá + đề xuất có/không tư vấn tiếp. SLA 1–2 ngày làm việc.",
    taskSteps: [
      "Đọc ticket + survey",
      "Hỏi Sales bổ sung nếu thiếu thông tin",
      "Họp nội bộ (nếu phức tạp) với Solution/Project/Product",
      "Soạn note đánh giá: khả thi, rủi ro, hướng demo/proposal",
    ],
    lessons: ["Đề bài GOV/BFSI cần check compliance sớm — tránh Go rồi mới phát hiện blocker"],
    exitCriteria: ["Có note đánh giá khả thi/rủi ro", "Xác định cần/không cần Solution/Project/Product tham gia", "Có đề xuất Go/No-Go sơ bộ"],
    risks: ["Đánh giá chỉ dựa vào cảm tính", "Bỏ qua compliance, dữ liệu hoặc tích hợp"],
    decisionOwner: "AI Lab - Consultant",
    customerExperiencePrompt: ["Thông tin nào từ KH thường thiếu khiến phải hỏi lại?"],
    docSlugs: ["chuan-tu-van-voice-bfsi", "chuan-kien-truc-ai-agent"],
  },
  "tv-2": {
    pic: "AI Lab - Consultant + Sales",
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Trình bày đánh giá kỹ thuật", "Đề xuất Go/No-Go"] },
      { unit: "Sales", raci: "PIC", duties: ["Đánh giá tiềm năng thương mại", "Quyết định đầu tư effort"] },
      { unit: "AM phụ trách", raci: "A", duties: ["Phê duyệt Go/No-Go"] },
      { unit: "Trưởng AI Lab - Consultant", raci: "A", duties: ["Phê duyệt Go/No-Go"] },
    ],
    coordination:
      "Họp 30 phút Sales + Consultant. No-Go: Sales thông báo KH lịch sự, lưu lý do. Go: chuyển sang chuẩn bị slide/demo với timeline 5 ngày.",
    taskSteps: [
      "Consultant trình bày note đánh giá",
      "Sales bổ sung góc nhìn thương mại & quan hệ KH",
      "Thống nhất Go/No-Go",
      "AM + Trưởng Consultant ký duyệt (email/minutes)",
    ],
    lessons: ["No-Go sớm tốt hơn under-deliver — ghi lại lý do vào CRM"],
  },
  "tv-3": {
    pic: "AI Lab - Consultant",
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Soạn slide đề xuất", "Chọn demo có sẵn hoặc custom"] },
      { unit: "Sales", raci: "C", duties: ["Review message thương mại", "Feedback tone KH"], support: "Biết gu trình bày của KH" },
      { unit: "AI Lab - Solution", raci: "C", duties: ["Hỗ trợ sơ đồ kiến trúc custom demo"], support: "Chỉ khi cần custom" },
    ],
    coordination:
      "Consultant draft slide theo template chuẩn. Sales review trong 1 ngày. Custom demo chỉ khi AM approve — tối đa 5 ngày làm việc.",
    taskSteps: [
      "Chọn template slide theo ngành/sản phẩm",
      "Gắn demo chuẩn hoặc yêu cầu custom",
      "Sales review nội dung thương mại",
      "Finalize bộ slide + kịch bản demo",
    ],
    lessons: ["Ưu tiên demo chuẩn FPT — custom tốn effort và khó bảo trì"],
    docSlugs: ["template-de-xuat-tu-van-gov", "chuan-tu-van-voice-bfsi"],
  },
  "tv-4": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Chủ trì workshop", "Điều phối agenda", "Ghi biên bản"] },
      { unit: "AI Lab - Consultant", raci: "R", duties: ["Khai thác yêu cầu kỹ thuật", "Ghi use case & ràng buộc"] },
      { unit: "Customer", raci: "C", duties: ["Cung cấp nghiệp vụ", "Xác nhận use case"], support: "Stakeholder nghiệp vụ + IT" },
    ],
    coordination:
      "Sales mở đầu mục tiêu workshop. Consultant dẫn phần kỹ thuật. Cuối buổi thống nhất 3–5 use case ưu tiên và dữ liệu KH có thể cung cấp.",
    taskSteps: [
      "Gửi agenda trước 2 ngày",
      "Workshop 2–4h: hiện trạng → pain point → use case",
      "Consultant ghi scope sơ bộ trên biên bản",
      "Sales gửi biên bản KH xác nhận trong 2 ngày",
    ],
    lessons: ["Thiếu stakeholder IT → không chốt được tích hợp", "Biên bản không xác nhận → tranh cãi scope sau"],
    docSlugs: ["playbook-tu-van-bfsi"],
  },
  "tv-5": {
    pic: "AI Lab - Consultant",
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Soạn Scope, Timeline, AC sơ bộ"] },
      { unit: "AI Lab - Project", raci: "C", duties: ["Review effort timeline"], support: "Man-day tham chiếu" },
      { unit: "Sales", raci: "C", duties: ["Review timeline thương mại"] },
    ],
    coordination:
      "Consultant draft trong 3 ngày, họp review nội bộ 1h với Project. Sales kiểm tra timeline có khớp kỳ vọng KH trước khi đưa vào proposal.",
    taskSteps: [
      "Liệt kê scope in/out rõ ràng",
      "Định nghĩa AC đo được (metric, môi trường test)",
      "Timeline giai đoạn Pilot/POC",
      "Review nội bộ + chỉnh sửa",
    ],
    lessons: ["AC mơ hồ → tranh cãi nghiệm thu Pilot/POC", "Scope quá rộng → không kết thúc đúng hạn"],
    docSlugs: ["template-effort-ai-agent", "playbook-effort-voice"],
  },
  "tv-6": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Tổng hợp proposal", "Gửi KH", "Theo dõi feedback"] },
      { unit: "AI Lab - Consultant", raci: "R", duties: ["Phần kỹ thuật proposal", "Review trước khi gửi"] },
    ],
    coordination:
      "Sales ghép phần thương mại + kỹ thuật. Consultant review trong 4h. Gửi KH và follow up trong 1 ngày làm việc.",
    taskSteps: [
      "Merge slide + scope + báo giá sơ bộ",
      "Consultant sign-off phần kỹ thuật",
      "Sales gửi email chính thức + đặt lịch trao đổi",
    ],
    lessons: ["Gửi proposal thiếu review Consultant → sai kỹ thuật, mất uy tín"],
    docSlugs: ["template-de-xuat-tu-van-gov"],
  },
  "tv-7": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Follow up KH", "Ghi nhận quyết định Yes/No Pilot/POC"] },
      { unit: "Customer", raci: "A", duties: ["Quyết định có triển khai Pilot/POC"] },
      { unit: "AI Lab - Consultant", raci: "I", duties: ["Tư vấn nếu KH hỏi thêm"] },
    ],
    coordination:
      "Sales follow up 2–3 lần trong tuần. Yes → chuyển giai đoạn Pilot/POC. No → đóng cơ hội hoặc nurture, ghi lý do.",
    taskSteps: [
      "Gọi/email KH trong 48h sau gửi proposal",
      "Làm rõ Pilot vs POC nếu KH chưa phân biệt",
      "Ghi quyết định vào CRM + thông báo AI Lab",
    ],
    lessons: ["Không phân biệt Pilot/POC với KH → kỳ vọng sai từ đầu giai đoạn 3"],
    docSlugs: ["mtqt-tu-van-ai-fpt"],
  },
  "pp-1": {
    pic: "Giám đốc AI Lab",
    participants: [
      { unit: "AI Lab", raci: "A", duties: ["Quyết định AI Lab tự làm hay bàn giao Delivery"] },
      { unit: "Delivery", raci: "C", duties: ["Xác nhận tiếp nhận (3.1b)"], support: "Năng lực & lịch team" },
      { unit: "Product", raci: "C", duties: ["Cam kết hỗ trợ (3.1c)"], support: "License, API, roadmap" },
      { unit: "Sales", raci: "I", duties: ["Cập nhật cam kết với KH"] },
    ],
    coordination:
      "Giám đốc AI Lab họp Delivery/Product trong 2 ngày. Chỉ cam kết KH khi cả Delivery (nếu bàn giao) và Product (nếu cần) đã đồng ý bằng văn bản/email.",
    taskSteps: [
      "Consultant trình bày scope đã thống nhất",
      "AI Lab quyết định: tự triển khai / bàn giao Delivery",
      "Delivery/Product phản hồi tiếp nhận/hỗ trợ",
      "Sales cập nhật KH đầu mối triển khai",
    ],
    lessons: ["Cam kết KH trước khi Delivery đồng ý → không đủ resource, trễ deadline"],
  },
  "pp-2": {
    pic: "AI Lab - Project / Solution / Delivery (theo quyết định 3.1)",
    participants: [
      { unit: "AI Lab - Project hoặc Delivery", raci: "PIC", duties: ["Soạn Scope/Timeline/AC chi tiết"] },
      { unit: "AI Lab - Consultant", raci: "C", duties: ["Đảm bảo khớp proposal"], support: "Context tư vấn" },
      { unit: "Sales", raci: "C", duties: ["Review timeline với KH"] },
      { unit: "Product", raci: "C", duties: ["Xác nhận phạm vi sản phẩm"], support: "Khi dùng platform FPT" },
    ],
    coordination:
      "Đội triển khai draft AC chi tiết, Consultant review khớp cam kết ban đầu. Sales validate với KH trước ký văn bản.",
    taskSteps: [
      "Breakdown workstream & milestone",
      "AC từng milestone (metric, data, môi trường)",
      "Timeline có buffer 15–20%",
      "Review 3 bên: triển khai, Consultant, Sales",
    ],
    lessons: ["POC phải ghi rõ giới hạn tính năng trong AC — tránh KH hiểu là production"],
    docSlugs: ["template-bao-cao-poc", "playbook-poc-cv-env"],
  },
  "pp-3": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Soạn thảo HĐ/văn bản xác nhận", "Đàm phán điều khoản"] },
      { unit: "AI Lab / Delivery", raci: "C", duties: ["Review phụ lục kỹ thuật & AC"] },
      { unit: "Customer", raci: "A", duties: ["Ký xác nhận"] },
      { unit: "Giám đốc Sales", raci: "A", duties: ["Phê duyệt nội bộ trước ký"] },
    ],
    coordination:
      "Sales dẫn đàm phán. Kỹ thuật review AC đính kèm. Không kick-off build trước khi có văn bản KH xác nhận.",
    taskSteps: [
      "Draft HĐ hoặc MOU Pilot/POC",
      "Gắn AC chi tiết làm phụ lục",
      "Giám đốc Sales approve",
      "KH ký + lưu bản scan",
    ],
    lessons: ["Build trước khi có văn bản → scope creep không được bảo vệ"],
  },
  "pp-4": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Điều phối daily/weekly với đội triển khai", "Báo cáo tiến độ KH"] },
      { unit: "AI Lab - Project / Delivery", raci: "R", duties: ["Thực hiện theo kế hoạch", "Escalate rủi ro"] },
    ],
    coordination:
      "Sales giữ một channel chung (Teams/Slack) với PM triển khai. Họp tiến độ 30 phút/tuần với KH khi cần.",
    taskSteps: [
      "Kick-off nội bộ Sales + triển khai",
      "Chốt cadence họp & báo cáo",
      "Sales là đầu mối duy nhất với KH về tiến độ",
    ],
    lessons: ["Nhiều đầu mối Sales/technical cùng email KH → KH bối rối"],
  },
  "pp-5": {
    pic: "AI Lab - Project / Solution / Delivery",
    participants: [
      { unit: "AI Lab - Project hoặc Delivery", raci: "PIC", duties: ["Xây dựng giải pháp", "Chạy SIT"] },
      { unit: "Product", raci: "C", duties: ["Hỗ trợ platform/API"], support: "Khi cần" },
      { unit: "AI Lab - Consultant", raci: "C", duties: ["Review khớp scope"], support: "Giải thích intent ban đầu" },
      { unit: "Sales", raci: "I", duties: ["Cập nhật KH tiến độ"] },
    ],
    coordination:
      "PM triển khai báo tiến độ 2 lần/tuần. SIT pass 100% checklist trước khi mời UAT. SLA 2–4 tuần tùy scope.",
    taskSteps: [
      "Setup môi trường & thu thập dữ liệu",
      "Develop/train theo AC",
      "SIT: test case + log kết quả",
      "Fix bug → re-SIT đến pass",
    ],
    lessons: ["Mời KH UAT khi SIT chưa pass → mất uy tín", "Voice/CV: test trên dữ liệu thật, không chỉ sample"],
    docSlugs: ["playbook-poc-cv-env", "kinh-nghiem-voice-callcenter-bank-x", "template-bao-cao-poc"],
  },
  "pp-6": {
    pic: "AI Lab - Project / Delivery",
    participants: [
      { unit: "AI Lab - Project hoặc Delivery", raci: "PIC", duties: ["Hỗ trợ UAT", "Thu thập kết quả", "Báo cáo Pass/Fail"] },
      { unit: "Customer", raci: "A", duties: ["Nghiệm thu UAT", "Quyết định Pass/Fail"] },
      { unit: "Sales", raci: "C", duties: ["Quản lý kỳ vọng KH", "Đàm phán nếu Fail"] },
      { unit: "Product", raci: "I", duties: ["Hỗ trợ nếu lỗi platform"] },
    ],
    coordination:
      "Triển khai demo UAT theo AC đã ký. Fail: họp root cause trong 48h, đề xuất remediation hoặc điều chỉnh scope. Pass: Sales đánh giá bước thầu hoặc ký HĐ chính thức.",
    taskSteps: [
      "Chuẩn bị môi trường UAT & user guide",
      "KH test theo checklist AC",
      "Ghi nhận kết quả Pass/Fail có chữ ký/email",
      "Handover tài liệu cho Sales (báo cáo PoC)",
    ],
    lessons: ["Không có biên bản UAT → tranh cãi giai đoạn thầu", "Ghi gap PoC vs production cho hồ sơ thầu"],
    docSlugs: ["template-bao-cao-poc", "kinh-nghiem-cv-nha-may-env"],
  },
  "th-1": {
    pic: "Sales",
    participants: [
      { unit: "Customer", raci: "R", duties: ["Gửi RFP / hồ sơ mời thầu"] },
      { unit: "Sales", raci: "PIC", duties: ["Tiếp nhận", "Phân tích deadline & tiêu chí", "Chuyển nội bộ"] },
    ],
    coordination: "Sales đọc RFP trong 24h, highlight deadline, tiêu chí kỹ thuật/năng lực, và ping Consultant ngay.",
    taskSteps: ["Lưu RFP vào repository dự án", "Tóm tắt 1 trang cho nội bộ", "Đặt lịch họp Bid/No-bid"],
    lessons: ["Trễ 1 ngày đọc RFP → thiếu thời gian soạn hồ sơ chất lượng"],
    docSlugs: ["chuan-checklist-thau-ai-agent"],
  },
  "th-2": {
    pic: "AI Lab - Consultant + Sales",
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Đánh giá khả năng đáp ứng kỹ thuật"] },
      { unit: "Sales", raci: "PIC", duties: ["Đánh giá chiến lược thầu"] },
      { unit: "AM + Trưởng Consultant", raci: "A", duties: ["Phê duyệt Bid/No-bid"] },
    ],
    coordination: "Họp 2h trong SLA 2 ngày. No-bid: thông báo lý do nội bộ. Bid: phân công soạn hồ sơ ngay.",
    taskSteps: ["Checklist năng lực vs RFP", "Họp Bid/No-bid", "Phê duyệt", "Phân công team soạn thầu"],
    lessons: ["Bid khi không đủ năng lực GOV → tốn effort và uy tín"],
    docSlugs: ["kinh-nghiem-thau-gov-ai-agent", "chuan-checklist-thau-ai-agent"],
  },
  "th-3": {
    pic: "AI Lab - Consultant",
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Viết phần kỹ thuật hồ sơ thầu"] },
      { unit: "AI Lab - Project", raci: "C", duties: ["Cung cấp effort, CV nhân sự"], support: "WBS tham chiếu" },
      { unit: "AI Lab - Solution", raci: "C", duties: ["Sơ đồ kiến trúc"], support: "Diagram chuẩn" },
      { unit: "Delivery", raci: "C", duties: ["Cam kết triển khai"], support: "Năng lực delivery" },
      { unit: "Product", raci: "C", duties: ["Thông tin sản phẩm"], support: "Datasheet, roadmap" },
      { unit: "Sales", raci: "I", duties: ["Ghép phần thương mại"] },
    ],
    coordination:
      "Consultant gửi template cho các khối điền input. Họp review chéo 1 lần trước deadline nộp 3 ngày.",
    taskSteps: [
      "Phân tích ma trận đáp ứng RFP",
      "Thu thập input từ Project/Solution/Delivery/Product",
      "Viết phương án kỹ thuật + ma trận traceability",
      "Review nội bộ & chỉnh sửa",
    ],
    lessons: ["Metric cam kết phải ≤ kết quả Pilot/POC đã chứng minh", "Copy-paste proposal cũ → không khớp RFP"],
    docSlugs: ["chuan-checklist-thau-ai-agent", "kinh-nghiem-thau-gov-ai-agent"],
  },
  "th-4": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Nộp hồ sơ đúng hạn", "Follow up BTC"] },
      { unit: "AI Lab - Consultant", raci: "C", duties: ["Hỗ trợ giải đáp kỹ thuật nếu BTC hỏi"] },
    ],
    coordination: "Sales nộp và giữ biên nhận. Follow up email/điện thoại 24–48h. Consultant standby trả lời thắc mắc kỹ thuật.",
    taskSteps: ["Checklist nộp đủ bản cứng/mềm", "Nộp + xác nhận", "Follow up", "Log Q&A từ BTC"],
    lessons: ["Nộp sát giờ không buffer → rủi ro lỗi format bị loại"],
  },
  "th-5": {
    pic: "Sales",
    participants: [
      { unit: "Customer", raci: "A", duties: ["Thông báo trúng/không trúng"] },
      { unit: "Sales", raci: "PIC", duties: ["Nhận kết quả", "Thông báo nội bộ", "Retrospective"] },
      { unit: "AI Lab - Consultant", raci: "I", duties: ["Ghi bài học kỹ thuật"] },
    ],
    coordination: "Thắng → chuyển giai đoạn Ký HĐ. Thua → họp retrospective 1h, cập nhật kho kinh nghiệm.",
    taskSteps: ["Nhận thông báo chính thức", "Thông báo team", "Retrospective", "Cập nhật kho tri thức"],
    lessons: ["Thua thầu mà không retrospective → lặp lại sai lầm"],
    docSlugs: ["kinh-nghiem-thau-gov-ai-agent"],
  },
  "kh-1": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Đàm phán thương mại", "Soạn thảo điều khoản"] },
      { unit: "AI Lab - Consultant", raci: "C", duties: ["Tư vấn điều khoản kỹ thuật/SLA"], support: "Review rủi ro cam kết" },
      { unit: "Customer", raci: "C", duties: ["Đàm phán phía KH"] },
    ],
    coordination: "Sales lead đàm phán. Mọi thay đổi scope/SLA phải có Consultant review trước khi Sales cam kết.",
    taskSteps: ["Review draft HĐ từ KH", "Đàm phán từng điều khoản", "Consultant review phụ lục kỹ thuật", "Chốt bản near-final"],
    lessons: ["Sales cam kết SLA kỹ thuật một mình → Delivery không ký được"],
  },
  "kh-2": {
    pic: "AI Lab - Consultant",
    participants: [
      { unit: "AI Lab - Consultant", raci: "PIC", duties: ["Soạn phụ lục kỹ thuật HĐ"] },
      { unit: "AI Lab - Project", raci: "C", duties: ["WBS, milestone"], support: "Effort đã thầu" },
      { unit: "Delivery", raci: "C", duties: ["Cam kết triển khai"], support: "Resource plan" },
      { unit: "Product", raci: "C", duties: ["License & support term"], support: "Khi có sản phẩm" },
    ],
    coordination: "Phụ lục kỹ thuật phải traceable với hồ sơ thầu đã nộp. Delivery sign-off năng lực trước khi ký.",
    taskSteps: ["Copy baseline từ hồ sơ thầu", "Cập nhật thay đổi đàm phán", "Review Delivery/Product", "Finalize phụ lục"],
    lessons: ["Phụ lục HĐ lệch hồ sơ thầu → BTC từ chối ký hoặc tranh chấp sau"],
    docSlugs: ["chuan-checklist-thau-ai-agent"],
  },
  "kh-3": {
    pic: "Sales",
    participants: [
      { unit: "Sales", raci: "PIC", duties: ["Điều phối ký kết", "Lưu trữ HĐ"] },
      { unit: "Customer", raci: "A", duties: ["Ký HĐ"] },
      { unit: "Lãnh đạo FCI", raci: "A", duties: ["Ký nội bộ"] },
      { unit: "Delivery", raci: "I", duties: ["Chuẩn bị nhận bàn giao"] },
    ],
    coordination:
      "Sau ký: Sales handover package (HĐ, AC, kết quả Pilot/POC, contact KH) cho Delivery trong 3 ngày. Kick-off Delivery trong 1 tuần.",
    taskSteps: ["Ký song phương", "Scan & lưu contract repository", "Handover meeting Sales → Delivery", "Lên lịch kick-off"],
    lessons: ["Handover miệng không tài liệu → Delivery thiếu context", "Kick-off trễ → KH mất niềm tin"],
    docSlugs: ["mtqt-tu-van-ai-fpt"],
  },
  "tk-1": {
    pic: "Delivery (PM dự án)",
    participants: [
      { unit: "Delivery", raci: "PIC", duties: ["Lập kế hoạch triển khai", "Quản lý team", "Nghiệm thu"] },
      { unit: "Giám đốc Delivery", raci: "A", duties: ["Phê duyệt kế hoạch & nguồn lực"] },
      { unit: "Sales", raci: "C", duties: ["Duy trì quan hệ KH"], support: "Escalation thương mại" },
      { unit: "AI Lab - Consultant", raci: "C", duties: ["Hỗ trợ làm rõ scope gốc"], support: "Handover tư vấn" },
      { unit: "Customer", raci: "C", duties: ["Nghiệm thu milestone"] },
    ],
    coordination:
      "Delivery nhận handover đủ: HĐ, AC, báo cáo Pilot/POC, biên bản UAT. PM setup governance với KH theo HĐ. Consultant on-call 2 tuần đầu.",
    taskSteps: [
      "Review handover package",
      "Kick-off với KH",
      "Triển khai theo WBS",
      "Nghiệm thu từng milestone",
      "Retrospective & cập nhật kho tri thức",
    ],
    lessons: [
      "Thiếu tài liệu Pilot/POC → rework 20–30% effort",
      "Retrospective sau go-live → cải tiến MTQT cho dự án sau",
    ],
    docSlugs: ["mtqt-tu-van-ai-fpt", "playbook-poc-cv-env"],
  },
};

/** Gộp enrichment vào sub-step */
export function enrichSubStep(
  sub: RoadmapSubStep,
  override?: SubStepOverride,
): RoadmapSubStep & StepEnrichment {
  const mergedSub: RoadmapSubStep = override
    ? {
        ...sub,
        title: override.title ?? sub.title,
        description: override.description ?? sub.description,
        deliverables: override.deliverables ?? sub.deliverables,
        responsible: override.responsible ?? sub.responsible,
        collaborators: override.collaborators ?? sub.collaborators,
        sla: override.sla ?? sub.sla,
        approver: override.approver ?? sub.approver,
        tips: override.tips ?? sub.tips,
      }
    : sub;

  const extra = STEP_ENRICHMENT[mergedSub.id];
  const defaults: StepEnrichment = {
    pic: override?.pic ?? mergedSub.responsible ?? "PIC cần phân công",
    participants: override?.participants ??
      (mergedSub.collaborators
      ? [
          { unit: mergedSub.responsible ?? "PIC", raci: "PIC", duties: [mergedSub.description] },
          {
            unit: mergedSub.collaborators,
            raci: "C",
            duties: ["Phối hợp theo yêu cầu"],
            support: "Cung cấp input/review để PIC hoàn thành việc",
          },
        ]
      : [{ unit: mergedSub.responsible ?? "PIC", raci: "PIC", duties: [mergedSub.description] }]),
    meaning: override?.meaning ?? mergedSub.description,
    inputs: override?.inputs ?? [
      "Thông tin từ giai đoạn/bước liền trước",
      "Template hoặc tài liệu chuẩn liên quan",
      "Context KH và ràng buộc đã ghi nhận",
    ],
    coordination:
      override?.coordination ??
      "Phối hợp theo RACI trong sơ đồ swimlane MTQT — liên hệ PIC khi cần làm rõ.",
    taskSteps:
      override?.taskSteps ??
      (mergedSub.deliverables?.map((d) => `Hoàn thành: ${d}`) ?? [mergedSub.description]),
    lessons: override?.lessons ?? mergedSub.tips,
    exitCriteria:
      override?.exitCriteria ??
      (mergedSub.deliverables?.length
        ? mergedSub.deliverables.map((d) => `Có ${d} được lưu/xác nhận`)
        : ["Kết quả bước đã được ghi nhận và thông báo cho các bên liên quan"]),
    risks: override?.risks ?? mergedSub.tips,
    decisionOwner: override?.decisionOwner ?? mergedSub.approver ?? mergedSub.responsible ?? "PIC bước này",
    customerExperiencePrompt: override?.customerExperiencePrompt ?? [
      "KH có phản hồi gì khác với giả định ban đầu?",
      "Có bài học nào cần lưu lại cho KH/ngành tương tự?",
    ],
  };
  if (!extra) {
    return {
      ...mergedSub,
      ...defaults,
    };
  }
  const mergedExtra: StepEnrichment = override
    ? {
        ...extra,
        pic: override.pic ?? extra.pic,
        meaning: override.meaning ?? extra.meaning,
        inputs: override.inputs ?? extra.inputs,
        coordination: override.coordination ?? extra.coordination,
        taskSteps: override.taskSteps ?? extra.taskSteps,
        lessons: override.lessons ?? extra.lessons,
        exitCriteria: override.exitCriteria ?? extra.exitCriteria,
        risks: override.risks ?? extra.risks,
        decisionOwner: override.decisionOwner ?? extra.decisionOwner,
        customerExperiencePrompt:
          override.customerExperiencePrompt ?? extra.customerExperiencePrompt,
        participants: override.participants ?? extra.participants,
      }
    : extra;
  return {
    ...mergedSub,
    ...defaults,
    ...mergedExtra,
    tips: mergedExtra.lessons.length > 0 ? mergedExtra.lessons : mergedSub.tips,
  };
}

export function enrichPhase(
  step: RoadmapStep,
  override?: PhaseOverride,
): RoadmapStep & PhaseEnrichment {
  const mergedStep: RoadmapStep = override
    ? {
        ...step,
        description: override.description ?? step.description,
        raciAccountable: override.raciAccountable ?? step.raciAccountable,
        raciResponsible: override.raciResponsible ?? step.raciResponsible,
        raciConsulted: override.raciConsulted ?? step.raciConsulted,
        objectives: override.objectives ?? step.objectives,
        outputs: override.outputs ?? step.outputs,
      }
    : step;

  const extra = PHASE_ENRICHMENT[mergedStep.slug];
  if (!extra) {
    return {
      ...mergedStep,
      meaning: override?.meaning ?? mergedStep.description,
      inputs: override?.inputs ?? ["Kết quả từ giai đoạn trước", "Thông tin KH và tài liệu liên quan"],
      outputsMeaning:
        override?.outputsMeaning ??
        mergedStep.outputs.map((o) => `${o} dùng làm căn cứ cho giai đoạn tiếp theo`),
      standardSteps:
        override?.standardSteps ?? mergedStep.subSteps.map((s) => `${s.code}. ${s.title}`),
      collaboration:
        override?.collaboration ??
        `A: ${mergedStep.raciAccountable}; R: ${mergedStep.raciResponsible}; C: ${mergedStep.raciConsulted}`,
      generalLessons: override?.generalLessons ?? mergedStep.pitfalls,
      customerExperiencePrompt: override?.customerExperiencePrompt ?? [
        "Ghi lại bối cảnh KH, vướng mắc, cách xử lý và kết quả cuối cùng",
      ],
      exitCriteria: override?.exitCriteria ?? mergedStep.outputs.map((o) => `Có ${o}`),
      decisionOwner: override?.decisionOwner ?? mergedStep.raciAccountable,
      risks: override?.risks ?? mergedStep.pitfalls,
    };
  }
  const mergedExtra: PhaseEnrichment = override
    ? {
        ...extra,
        meaning: override.meaning ?? extra.meaning,
        inputs: override.inputs ?? extra.inputs,
        outputsMeaning: override.outputsMeaning ?? extra.outputsMeaning,
        standardSteps: override.standardSteps ?? extra.standardSteps,
        collaboration: override.collaboration ?? extra.collaboration,
        generalLessons: override.generalLessons ?? extra.generalLessons,
        customerExperiencePrompt:
          override.customerExperiencePrompt ?? extra.customerExperiencePrompt,
        exitCriteria: override.exitCriteria ?? extra.exitCriteria,
        decisionOwner: override.decisionOwner ?? extra.decisionOwner,
        risks: override.risks ?? extra.risks,
      }
    : extra;
  return {
    ...mergedStep,
    ...mergedExtra,
  };
}

export const RACI_LABEL: Record<RaciTag, string> = {
  PIC: "Phụ trách chính",
  A: "Phê duyệt",
  R: "Thực hiện",
  C: "Phối hợp / Tư vấn",
  I: "Thông báo",
};

export const RACI_COLOR: Record<RaciTag, string> = {
  PIC: "bg-primary text-primary-foreground",
  A: "bg-phase-bid text-phase-bid-foreground",
  R: "bg-phase-consult text-phase-consult-foreground",
  C: "bg-phase-poc text-phase-poc-foreground",
  I: "bg-muted text-muted-foreground",
};
