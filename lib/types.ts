/** Used in screen components to avoid JSX parser confusion with Partial<FormState> in props */
export type FormUpdateFn = (u: Partial<FormState>) => void;

export interface FormState {
  // מסך 1
  gender: string;
  employment: string;
  full_name: string;
  phone: string;
  // מסך 2
  age: string;
  age_group: string;
  residence: string;
  household_size: string;
  family_income: string;
  own_capital: string;
  // מסך 3
  email: string;
  property_status: string;
  stock_market: string;
  investments_abroad: boolean | undefined;
  investments_abroad_scope: string;
  has_land: boolean | undefined;
  has_deposits: boolean | undefined;
  deposits_scope: string;
  // מסך 4
  mortgage_pays: boolean | undefined;
  mortgage_amount: string;
  pension_optimization: string;
  tax_consulting: boolean | undefined;
  tax_consulting_when: string;
  provident_withdrawals: boolean | undefined;
  provident_when: string;
  id_upload_skipped: boolean | undefined;
  clearinghouse_skipped: boolean | undefined;
  // legacy / מסך 3 ישן (למען decile)
  pension_checked: boolean | undefined;
  mortgage_pct: string;
  insurance_pct: string;
}
