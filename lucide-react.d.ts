declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  // 🚀 ADICIONAMOS ESTA INTERFACE PARA O TS RECONHECER O 'size'
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  // Mudamos aqui para usar a nossa nova interface LucideProps
  export type LucideIcon = ComponentType<LucideProps>;

  export const Activity: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Activity: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const CircleCheck: LucideIcon;
  export const Clock: LucideIcon;
  export const Copy: LucideIcon;
  export const CreditCard: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Download: LucideIcon;
  export const Edit: LucideIcon;
  export const Heart: LucideIcon;
  export const Instagram: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LogOut: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon; 
  export const Minus: LucideIcon;
  export const PackageCheck: LucideIcon;
  export const Phone: LucideIcon;
  export const Plus: LucideIcon;
  export const Receipt: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Trash2: LucideIcon;
  export const Bike: LucideIcon;
  export const User: LucideIcon;
  export const UtensilsCrossed: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const MessageSquareText: LucideIcon;

  export default {} as Record<string, LucideIcon>;
}