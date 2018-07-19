export const SWITCH_COLOR = "SWITCH_COLOR";
export const SWITCH_LANG = "SWITCH_LANG";

export const switchColor = color => ({
  type: SWITCH_COLOR,
  color
});

export const switchLang = lang => ({
  type: SWITCH_LANG,
  lang
});
