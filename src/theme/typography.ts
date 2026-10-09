import { colors } from './colors';

// Fredoka (rounded, playful) for display text; Quicksand (rounded, still
// legible at small sizes) for body text — both loaded via expo-font in
// app/_layout.tsx. Custom Google Fonts ship as distinct per-weight family
// names rather than a single variable font, so weight is chosen by family
// here rather than via a `fontWeight` style (which these fonts ignore).
export const typography = {
  title: { fontSize: 30, fontFamily: 'Fredoka_700Bold', color: colors.text },
  heading: { fontSize: 20, fontFamily: 'Fredoka_600SemiBold', color: colors.text },
  body: { fontSize: 16, fontFamily: 'Quicksand_500Medium', color: colors.text },
  bodyStrong: { fontSize: 16, fontFamily: 'Quicksand_700Bold', color: colors.text },
  caption: { fontSize: 13, fontFamily: 'Quicksand_500Medium', color: colors.textMuted },
  button: { fontSize: 16, fontFamily: 'Fredoka_600SemiBold', color: '#FFFFFF' },
};
