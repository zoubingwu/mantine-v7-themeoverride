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
  rem,
  Card,
  Group,
  Loader,
  DEFAULT_THEME,
  mergeMantineTheme,
  Box,
  Anchor,
  Divider,
  Skeleton,
  SkeletonProps,
  Tabs,
  Notification,
  Text,
  Menu,
  MenuProps,
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
  keyframes,
} from "@mantine/emotion";
import {
  IconX,
  IconCheck,
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";

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
    Loader: {
      defaultProps: {
        color: "carbon.5",
      },
    },
    Skeleton: {
      styles(theme: MantineTheme, props: SkeletonProps) {
        const animation = keyframes({
          "0%": {
            backgroundPosition: "200% 0",
          },
          "100%": {
            backgroundPosition: "-200% 0",
          },
        });
        const c1 = themeColor(theme, "carbon", 2);
        const c2 = themeColor(theme, "carbon", 4);
        return {
          root: {
            "&::after": {
              backgroundImage: `linear-gradient(90deg,${c1},${c2},${c1},${c2})`,
              backgroundSize: "400% 100%",
              animation: props.animate
                ? `${animation} 5000ms ease-in-out infinite`
                : "none",
            },
          },
        };
      },
    },
    Card: {
      defaultProps: {
        shadow: "xs",
        withBorder: true,
      },
      styles: (theme: MantineTheme) => {
        return {
          root: {
            backgroundColor: theme.colors.carbon[0],
          },
        };
      },
    },
    Anchor: {
      defaultProps: {
        c: "peacock.7",
      },
    },
    Divider: {
      defaultProps: {
        color: "carbon.4",
      },
    },
    Tabs: {
      styles(theme: MantineTheme) {
        return {
          list: {
            gap: 32,
            border: 0,
          },
          tab: {
            color: themeColor(theme, "carbon", 7),
            fontWeight: 600,
            paddingLeft: 0,
            paddingRight: 0,
            "&[data-active]": {
              color: themeColor(theme, "carbon", 9),
            },
            "&:hover": {
              color: themeColor(theme, "carbon", 9),
            },
            "&:focus": { outlineColor: "transparent" },
          },
        };
      },
    },
    Notification: {
      styles: (theme: MantineTheme) => {
        return {
          root: {
            padding: 8,
            paddingLeft: 28,

            "&:before": {
              top: 8,
              bottom: 8,
              left: 8,
              width: 4,
            },
          },
          body: {
            marginRight: 8,
            lineHeight: 20,
            fontSize: 16,
          },
          title: {
            fontWeight: 600,
            color: themeColor(theme, "carbon", 8),
          },
          description: {
            color: themeColor(theme, "carbon", 7),
          },
        };
      },
    },
    Menu: {
      styles: (theme: MantineTheme, props: MenuProps) => {
        const textColor = themeColor(theme, "carbon", 8);
        const bgHoverColor = themeColor(theme, "carbon", 2);
        const bgActiveColor = themeColor(theme, "carbon", 3);
        const disabledColor = themeColor(theme, "carbon", 6);
        return {
          dropdown: {
            boxShadow: theme.shadows.md,
          },
          item: {
            transition: "background 150ms ease-in-out",
            color: textColor,
            "&:hover, &[data-hovered]": {
              color: textColor,
              backgroundColor: bgHoverColor,
              textDecoration: "none",
            },
            "&:active, &[data-active]": {
              color: textColor,
              backgroundColor: bgActiveColor,
            },
            "&:disabled, &[data-disabled]": {
              color: disabledColor,
              userSelect: "none",
              cursor: "not-allowed",
              "&:hover, &[data-hovered]": {
                color: disabledColor,
                backgroundColor: "transparent",
              },
            },
          },
        };
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
    getInitialValueInEffect: false,
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

const variants = ["default", "filled", "light", "subtle", "outline"];
const sizes = ["xs", "sm", "md", "lg", "xl"];

function TestButtons() {
  return (
    <Card withBorder shadow="md">
      <h2>Button</h2>
      <Group>
        {["carbon", "peacock", "red"].map((color) => {
          return variants.map((variant) => {
            return sizes.map((size) => {
              return (
                <Button
                  key={`${variant}-${size}-${color}`}
                  color={color}
                  variant={variant}
                  size={size}
                >
                  {variant} {size}
                </Button>
              );
            });
          });
        })}

        <Button loading size="md">
          Loading...
        </Button>
        <Button leftSection={<Loader size="xs" />}>with left section</Button>
        <Button rightSection={<Loader size="xs" />}>with right section</Button>
      </Group>
    </Card>
  );
}

function TestAnchors() {
  return (
    <Card withBorder shadow="md">
      <h2>Anchor</h2>
      <Group>
        <Anchor href="https://mantine.dev">Mantine</Anchor>
        {["carbon", "peacock", "red"].map((color) => {
          return (
            <Anchor key={color} c={color}>
              {color}
            </Anchor>
          );
        })}

        <Anchor href="https://mantine.dev" c="carbon.9">
          carbon.9
        </Anchor>
      </Group>
    </Card>
  );
}

function TestSkeletons() {
  return (
    <Card withBorder shadow="md">
      <h2>Skeleton</h2>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Card>
  );
}

function TestTabs() {
  return (
    <Card withBorder shadow="md">
      <h2>Tabs</h2>
      <Tabs defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
          <Tabs.Tab value="messages">Messages</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>
        <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>
        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </Card>
  );
}

function TestNotifications() {
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  return (
    <Card withBorder shadow="md">
      <h2>Notification</h2>
      <Notification icon={xIcon} color="red" title="Bummer!">
        Something went wrong
      </Notification>
      <Notification icon={checkIcon} color="teal" title="All good!" mt="md">
        Everything is fine
      </Notification>
    </Card>
  );
}

function TestMenu() {
  return (
    <Card withBorder shadow="md">
      <h2>Menu</h2>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button>Toggle menu</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item
            leftSection={
              <IconSettings style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Settings
          </Menu.Item>
          <Menu.Item
            disabled
            leftSection={
              <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Messages
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconPhoto style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Gallery
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSearch style={{ width: rem(14), height: rem(14) }} />
            }
            rightSection={
              <Text size="xs" c="dimmed">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            leftSection={
              <IconArrowsLeftRight
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Transfer my data
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconTrash
                style={{ width: rem(14), height: rem(14), color: "red" }}
              />
            }
          >
            <Text c="red">Delete my account</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}

function App() {
  const { setColorScheme } = useColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  console.log("computedColorScheme", computedColorScheme);

  return (
    <Box p="md">
      <h1>hello world</h1>
      <Group mb="md">
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

      <TestButtons />
      <Divider my="md" />
      <TestAnchors />
      <Divider my="md" />
      <TestSkeletons />
      <Divider my="md" />
      <TestTabs />
      <Divider my="md" />
      <TestNotifications />
      <Divider my="md" />
      <TestMenu />
    </Box>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <App />
  </Provider>,
);
