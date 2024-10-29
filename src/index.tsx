import React from "react";
import ReactDOM from "react-dom/client";
import {
  Button,
  ButtonProps,
  MantineProvider,
  MantineTheme,
  createTheme,
  useComputedColorScheme,
  getPrimaryShade,
  getThemeColor,
  Card,
  Group,
  Loader,
  DEFAULT_THEME,
  mergeMantineTheme,
} from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import * as dark from "./color.dark";
import * as light from "./color";
import type { ShadingColor } from "./color";
import "@mantine/core/styles.css";
import {
  EmotionHelpers,
  emotionTransform,
  MantineEmotionProvider,
} from "@mantine/emotion";

export type ColorMap = typeof light;
export type Color = keyof ColorMap;
export const Colors = Object.keys(light) as Color[];

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<Color | (string & {}), ShadingColor>;
  }
}

function useSystemColorScheme(initialValue?: "dark" | "light") {
  return useMediaQuery(
    "(prefers-color-scheme: dark)",
    initialValue === "dark",
    { getInitialValueInEffect: false },
  )
    ? "dark"
    : "light";
}

function themeColor(theme: MantineTheme, color: string, shade: number) {
  return getThemeColor([color, shade].join("."), theme);
}

const theme = createTheme({
  primaryColor: "carbon",
  primaryShade: 7,
  defaultRadius: 8,
  cursorType: "pointer",
  fontFamily: "Inter, sans-serif",
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "60em",
    lg: "75em",
    xl: "90em",
  },
  shadows: {
    xs: "0px 2px 4px rgba(0, 0, 0, 0.04)",
    sm: "0px 4px 16px rgba(0, 0, 0, 0.04)",
    md: "0px 8px 32px rgba(0, 0, 0, 0.08)",
    lg: "0px 8px 64px rgba(0, 0, 0, 0.08)",
    xl: "0px 16px 64px rgba(0, 0, 0, 0.08)",
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "14px",
    lg: "18px",
    xl: "20px",
  },
  components: {
    Button: {
      defaultProps: {
        size: "md",
        variant: "filled",
      },
      styles: (theme: MantineTheme, props: ButtonProps, u: EmotionHelpers) => {
        let color = props.color || theme.primaryColor;

        const getFilledStyles = () => {
          const bgColorShade = color.includes("carbon")
            ? 9
            : getPrimaryShade(theme, "light");
          const hoverBgColorShade = color.includes("carbon")
            ? bgColorShade - 1
            : bgColorShade + 1;

          const bgColor = themeColor(theme, color, bgColorShade);
          const bgHoverColor = themeColor(theme, color, hoverBgColorShade);

          return {
            color: theme.white,
            backgroundColor: bgColor,

            "&:hover": {
              backgroundColor: bgHoverColor,
            },

            "&:disabled": {
              color: theme.white,
              backgroundColor: themeColor(theme, color, 5),
            },
          };
        };

        const getLightStyles = () => {
          color = color || "peacock";
          const fontColorShade = 7;
          const bgColorShade = 1;
          const borderColorShade = 4;

          return {
            color: themeColor(theme, color, fontColorShade),
            backgroundColor: themeColor(theme, color, bgColorShade),
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: themeColor(theme, color, borderColorShade),

            "&:hover": {
              color: themeColor(theme, color, fontColorShade + 1),
              borderColor: themeColor(theme, color, borderColorShade + 1),
              backgroundColor: themeColor(theme, color, bgColorShade + 1),
            },

            "&:disabled": {
              color: themeColor(theme, theme.primaryColor, 6),
              borderColor: themeColor(
                theme,
                theme.primaryColor,
                borderColorShade + 1,
              ),
              backgroundColor: themeColor(theme, theme.primaryColor, 2),
            },
          };
        };

        const getDefaultStyles = () => {
          const fontColorShade = color === "carbon" ? 8 : 7;
          const bgColorShade = 2;
          const borderColorShade = color === "carbon" ? 5 : 4;

          return {
            color: themeColor(theme, color, fontColorShade),
            backgroundColor: themeColor(theme, color, bgColorShade),
            borderColor: themeColor(theme, color, borderColorShade),

            "&:hover": {
              color: themeColor(theme, color, fontColorShade + 1),
              borderColor: themeColor(theme, color, borderColorShade + 1),
              backgroundColor: themeColor(theme, color, bgColorShade + 1),
            },

            "&:disabled": {
              color: themeColor(theme, theme.primaryColor, 6),
              borderColor: themeColor(
                theme,
                theme.primaryColor,
                borderColorShade + 1,
              ),
              backgroundColor: themeColor(theme, theme.primaryColor, 2),
            },
          };
        };

        const getSubtleStyles = () => {
          color = color || "peacock";
          const fontColorShade = 7;
          const bgColorShade = 1;

          return {
            color: themeColor(theme, color, fontColorShade),
            backgroundColor: "transparent",

            "&:hover": {
              color: themeColor(theme, color, fontColorShade + 1),
              backgroundColor: themeColor(theme, color, bgColorShade + 1),
            },

            "&:disabled": {
              color: themeColor(theme, theme.primaryColor, 6),
              backgroundColor: theme.white,
            },
          };
        };

        const variantStyles = {
          filled: getFilledStyles(),
          light: getLightStyles(),
          default: getDefaultStyles(),
          subtle: getSubtleStyles(),
          outline: getDefaultStyles(),
        };

        const sizeStyles = {
          xs: {
            height: 28,
          },
          sm: {
            height: 32,
          },
          md: {
            height: 40,
          },
          lg: {
            height: 48,
          },
          xl: {
            height: 56,
          },
        };

        // @ts-ignore
        const variantStyle = variantStyles[props.variant!];
        // @ts-ignore
        const sizeStyle = sizeStyles[props.size!];

        const finalStyles = {
          label: {
            fontWeight: 500,
            fontSize: props.size === "xs" ? 12 : 14,
          },
          root: {
            paddingLeft: 12,
            paddingRight: 12,
            ...variantStyle,
            ...sizeStyle,
          },
          leftIcon: {
            marginRight: 4,
          },
          rightIcon: {
            marginLeft: 4,
          },
        };

        return finalStyles;
      },
    },
  },
});

function useColorScheme() {
  const [colorScheme, setColorScheme] = useLocalStorage<
    "light" | "dark" | "auto"
  >({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  return { colorScheme, setColorScheme };
}

function Provider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const { colorScheme } = useColorScheme();
  const colorSchemeResult =
    colorScheme === "auto" ? systemColorScheme : colorScheme;

  console.log("colorSchemeResult", colorSchemeResult);

  const isLight = colorSchemeResult === "light";
  const colors = isLight ? light : dark;

  return (
    <MantineProvider
      forceColorScheme={colorSchemeResult}
      stylesTransform={emotionTransform}
      theme={mergeMantineTheme(DEFAULT_THEME, {
        ...theme,
        colors,
        white: colors.carbon[0],
        black: colors.carbon[8],
      })}
    >
      <MantineEmotionProvider>{children}</MantineEmotionProvider>
    </MantineProvider>
  );
}

function App() {
  const { setColorScheme } = useColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  console.log("computedColorScheme", computedColorScheme);

  return (
    <div>
      <h1>hello world</h1>
      <Group>
        <Button onClick={() => setColorScheme("light")}>
          Color Scheme Light
        </Button>
        <Button onClick={() => setColorScheme("dark")}>
          Color Scheme Dark
        </Button>
        <Button onClick={() => setColorScheme("auto")}>
          Color Scheme Auto
        </Button>
      </Group>
      <Card withBorder shadow="md" m="md">
        <Group>
          {["default", "filled", "light", "subtle", "outline"].map(
            (variant) => {
              return ["xs", "sm", "md", "lg", "xl"].map((size) => {
                return (
                  <Button
                    key={`${variant}-${size}`}
                    variant={variant}
                    size={size}
                  >
                    {variant} {size}
                  </Button>
                );
              });
            },
          )}

          <Button loading size="md">
            Loading...
          </Button>
          <Button leftSection={<Loader size="xs" />}>with left section</Button>
        </Group>
      </Card>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <App />
  </Provider>,
);
