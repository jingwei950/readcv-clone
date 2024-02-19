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

// TODO: Change name to "PostReactionButtonObj"
export interface PostButtonObj extends ButtonObj {
  commentCount?: number;
  repostCount?: number;
  likeCount?: number;
  icon: PostButton;
}
