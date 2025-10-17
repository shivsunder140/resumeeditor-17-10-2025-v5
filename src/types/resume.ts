export interface Resume {
  id: string;
  user_id?: string;
  title: string;
  type: 'master' | 'campaign';
  content: string;
  ats_score: number;
  template_id: string;
  colors: ColorPalette;
  formatting: FormattingSettings;
  active_sections: string[];
  created_at: string;
  updated_at: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface FormattingSettings {
  alignment: 'left' | 'center' | 'right';
  textColor: string;
  highlightColor: string;
  fontStyle: string;
  fontSize: number;
  headingSize: number;
  sectionSpacing: number;
  paragraphSpacing: number;
  lineSpacing: number;
  topBottomMargin: number;
  sideMargins: number;
  paragraphIndent: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'classic' | 'modern' | 'photo';
  preview: string;
  description: string;
}
