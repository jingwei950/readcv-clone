export interface NavButton {
  solid: string;
  outline: string;
}

export interface PostButton {
  light: string;
  dark: string;
  solid?: string;
}

export interface ButtonObj {
  name: string;
  alias: string;
  path?: string;
}

export interface NavButtonObj extends ButtonObj {
  icon: NavButton;
}

export interface PostButtonObj extends ButtonObj {
  icon: PostButton;
}
