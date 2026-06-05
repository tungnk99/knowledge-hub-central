import { Checkbox } from "@/components/ui/checkbox";
import {
  VERTICALS,
  PRODUCTS,
  PHASES,
  DOC_TYPES,
  DOC_CATEGORIES,
  FILE_FORMATS,
  DOC_STATUSES,
  type Vertical,
  type Product,
  type Phase,
  type DocType,
  type DocCategory,
  type FileFormat,
  type DocStatus,
} from "@/lib/taxonomy";

export interface FilterState {
  verticals: Vertical[];
  products: Product[];
  phases: Phase[];
  types: DocType[];
  categories: DocCategory[];
  fileFormats: FileFormat[];
  statuses: DocStatus[];
}

export const emptyFilter: FilterState = {
  verticals: [],
  products: [],
  phases: [],
  types: [],
  categories: [],
  fileFormats: [],
  statuses: [],
};

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterSidebar({ value, onChange }: Props) {
  const sections: {
    title: string;
    key: keyof FilterState;
    options: readonly string[];
  }[] = [
    { title: "Khối khách hàng", key: "verticals", options: VERTICALS },
    { title: "Sản phẩm", key: "products", options: PRODUCTS },
    { title: "Giai đoạn", key: "phases", options: PHASES },
    { title: "Loại tài liệu", key: "types", options: DOC_TYPES },
    { title: "Định dạng file", key: "fileFormats", options: FILE_FORMATS },
    { title: "Loại nội dung", key: "categories", options: DOC_CATEGORIES },
    { title: "Trạng thái", key: "statuses", options: DOC_STATUSES },
  ];

  const totalSelected =
    value.verticals.length +
    value.products.length +
    value.phases.length +
    value.types.length +
    value.categories.length +
    value.fileFormats.length +
    value.statuses.length;

  return (
    <aside className="space-y-5 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Bộ lọc</h3>
        {totalSelected > 0 && (
          <button
            onClick={() => onChange(emptyFilter)}
            className="text-xs text-primary hover:underline"
          >
            Xoá lọc
          </button>
        )}
      </div>

      {sections.map((sec) => (
        <div key={sec.key} className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {sec.title}
          </h4>
          <div className="space-y-1.5">
            {sec.options.map((opt) => {
              const checked = (value[sec.key] as string[]).includes(opt);
              return (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      onChange({
                        ...value,
                        [sec.key]: toggle(value[sec.key] as string[], opt),
                      } as FilterState)
                    }
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

export function applyFilters<
  T extends {
    verticals: string[];
    products: string[];
    phases: string[];
    type: string;
    category: string;
    fileFormat: string;
    status: string;
    title: string;
    summary: string;
    body?: string;
  },
>(docs: T[], filter: FilterState, query: string): T[] {
  const q = query.trim().toLowerCase();
  return docs.filter((d) => {
    if (filter.verticals.length && !d.verticals.some((v) => filter.verticals.includes(v as Vertical))) return false;
    if (filter.products.length && !d.products.some((v) => filter.products.includes(v as Product))) return false;
    if (filter.phases.length && !d.phases.some((v) => filter.phases.includes(v as Phase))) return false;
    if (filter.types.length && !filter.types.includes(d.type as DocType)) return false;
    if (filter.categories.length && !filter.categories.includes(d.category as DocCategory)) return false;
    if (filter.fileFormats.length && !filter.fileFormats.includes(d.fileFormat as FileFormat)) return false;
    if (filter.statuses.length && !filter.statuses.includes(d.status as DocStatus)) return false;
    if (q) {
      const haystack =
        `${d.title} ${d.summary} ${d.body ?? ""} ${d.category} ${d.fileFormat} ${d.type}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
