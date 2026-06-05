import { cn } from "@/lib/utils";
import {
  verticalClass,
  productClass,
  phaseClass,
  typeClass,
  statusClass,
  type Vertical,
  type Product,
  type Phase,
  type DocType,
  type DocStatus,
} from "@/lib/taxonomy";

type Props =
  | { kind: "vertical"; value: Vertical }
  | { kind: "product"; value: Product }
  | { kind: "phase"; value: Phase }
  | { kind: "type"; value: DocType }
  | { kind: "status"; value: DocStatus };

export function TagBadge(props: Props & { className?: string }) {
  const { kind, value, className } = props;
  let cls = "";
  if (kind === "vertical") cls = verticalClass[value as Vertical];
  else if (kind === "product") cls = productClass[value as Product];
  else if (kind === "phase") cls = phaseClass[value as Phase];
  else if (kind === "type") cls = typeClass[value as DocType];
  else if (kind === "status") cls = statusClass[value as DocStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        cls,
        className,
      )}
    >
      {value}
    </span>
  );
}
