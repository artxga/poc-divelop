export type IndicatorStandard = "GRI" | "SASB" | "ODS" | "TCFD" | "Manual";
export type IndicatorCategory = "Ambiental" | "Social" | "Gobernanza";
export type IndicatorDataType = "numero" | "texto" | "porcentaje" | "booleano" | "seleccion";

export interface Indicator {
  id: string;
  code: string;
  name: string;
  description: string;
  standard: IndicatorStandard;
  category: IndicatorCategory;
  dataType: IndicatorDataType;
  unit?: string;
  options?: string[];
}
