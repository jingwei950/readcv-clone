export interface ButtonObj {
  name: string;
  alias: string;
  path?: string;
}

export interface NavButtonObj extends ButtonObj {
  icon: string;
  iconSolid: string;
  iconSelected?: boolean;
}

export interface NavButtonObjState {
  name: string;
  iconState: boolean;
}

// TODO: Change name to "PostReactionButtonObj"
export interface PostButtonObj extends ButtonObj {
  commentCount?: number;
  repostCount?: number;
  likeCount?: number;
  icon: string;
}
