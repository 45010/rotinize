import { DefaultTheme } from 'react-native-paper';
import { colors } from './colors';

export const theme = {
    ...DefaultTheme, // Copia as propriedades do tema padr�o
    colors: {
        ...DefaultTheme.colors,
        // Cores Prim�rias
        primary: colors.primaryBase,
        primaryContainer: colors.primaryLight,
        onPrimaryContainer: colors.primaryDark,

        // Cores Secund�rias
        secondary: colors.secondaryBase,
        secondaryContainer: colors.secondaryLight,
        onSecondaryContainer: colors.secondaryDark,

        // Cores Complementares
        tertiary: colors.tertiaryBase,
        tertiaryContainer: colors.tertiaryLight,
        onTertiaryContainer: colors.tertiaryDark,

        // Outras cores do tema
        error: colors.error,
        background: "#FFFFFF",
    },
    fonts: {
        ...DefaultTheme.fonts,
        //TODO adicionar estilos de tipografia customizados
    },
};