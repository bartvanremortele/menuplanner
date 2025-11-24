// Temporary ambient types to ensure lint/typecheck stability for geist/font
declare module "geist/font" {
  export function Geist(options?: { variable?: string }): {
    className: string;
    variable: string;
  };
  export function Geist_Mono(options?: { variable?: string }): {
    className: string;
    variable: string;
  };
}
