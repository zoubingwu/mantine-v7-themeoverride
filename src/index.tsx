import React, { useState } from "react";
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
  getSize,
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
  NavLinkProps,
  StepperProps,
  AlertProps,
  NavLink,
  Badge,
  Stepper,
  Alert,
  TabsProps,
  SelectProps,
  InputProps,
  TextareaProps,
  MultiSelectProps,
  Input,
  Select,
  MultiSelect,
  Textarea,
  PasswordInput,
  NumberInput,
  Stack,
  TextInput,
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
  IconInfoCircle,
} from "@tabler/icons-react";

export type ColorMap = typeof light;
export type Color = keyof ColorMap;
export const Colors = Object.keys(light) as Color[];

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<Color | (string & {}), ShadingColor>;
  }
}

function useOperateSystemColorScheme() {
  return useMediaQuery("(prefers-color-scheme: dark)", false, {
    getInitialValueInEffect: false,
  })
    ? "dark"
    : "light";
}

function themeColor(theme: MantineTheme, color: string, shade: number) {
  return getThemeColor([color, shade].join("."), theme);
}

function getInputStyles(theme: MantineTheme, props: Pick<InputProps, "size">) {
  const sizes = {
    xl: 48,
    lg: 44,
    md: 40,
    sm: 32,
    xs: 28,
  };
  const fontSizes = {
    xl: 16,
    lg: 14,
    md: 14,
    sm: 13,
    xs: 12,
  };
  // @ts-ignore
  const size = sizes[props.size ?? "md"];
  // @ts-ignore
  const inputFontSize = fontSizes[props.size ?? "md"];

  const inputSize = {
    height: size,
    minHeight: size,
    lineHeight: `${size - 2}px`,
    fontSize: inputFontSize,
  };
  const passwordInnerInputSize = {
    height: size - 2,
    minHeight: size - 2,
    lineHeight: `${size - 2}px`,
    fontSize: inputFontSize,
  };

  return {
    label: {
      color: themeColor(theme, "carbon", 8),
      marginBottom: 6,
      lineHeight: "20px",
      fontSize: 14,
    },
    description: {
      color: themeColor(theme, "carbon", 7),
      fontSize: 12,
    },
    input: {
      ...inputSize,
      color: theme.colors.carbon[8],
      border: `1px solid ${themeColor(theme, "carbon", 4)}`,
      backgroundColor: themeColor(theme, "carbon", 0),

      "&:hover": {
        borderColor: themeColor(theme, "carbon", 5),
      },
      "&:focus, &:focus-within": {
        borderColor: themeColor(theme, "carbon", 9),
      },
      "&:disabled": {
        borderColor: themeColor(theme, "carbon", 4),
        backgroundColor: themeColor(theme, "carbon", 2),
        color: themeColor(theme, "carbon", 8),
        opacity: 1,
      },
      "&::placeholder": {
        color: themeColor(theme, "carbon", 6),
      },

      "& .mantine-PasswordInput-innerInput": {
        ...passwordInnerInputSize,
        "&::placeholder": {
          color: themeColor(theme, "carbon", 6),
        },
      },
    },
    error: {
      color: themeColor(theme, "red", 7),
    },
    wrapper: {
      "&[data-error]": {
        ".mantine-Input-input, .mantine-TextInput-input, .mantine-PasswordInput-innerInput":
          {
            color: themeColor(theme, "red", 7),
            borderColor: themeColor(theme, "red", 4),

            "& .mantine-PasswordInput-innerInput": {
              borderColor: "transparent",
            },
            "&:hover": {
              borderColor: themeColor(theme, "red", 4),
            },
            "&:focus, &:focus-within": {
              borderColor: themeColor(theme, "red", 4),
            },
            "&::placeholder": {
              color: themeColor(theme, "carbon", 6),
            },
          },
      },
    },
    section: {
      overflow: "hidden",
    },
  };
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
    Tabs: {
      styles(theme: MantineTheme, props: TabsProps) {
        return {
          list: {
            gap: props.orientation === "vertical" ? 8 : 32,
            border: 0,
          },
          tab: {
            color: themeColor(theme, "carbon", 7),
            fontWeight: 600,
            paddingLeft: 0,
            paddingRight: props.orientation === "vertical" ? 8 : 0,
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
    NavLink: {
      defaultProps: {
        px: 10,
        lh: 1.5,
        fw: 500,
        variant: "light",
      },
      styles: (theme: MantineTheme, props: NavLinkProps) => {
        const withThemeColor = (shade: number) =>
          themeColor(theme, props.color ?? theme.primaryColor, shade);

        const rootStyles = {
          light: {
            color: withThemeColor(8),
            "&:hover": {
              color: withThemeColor(8),
              backgroundColor: withThemeColor(2),
            },
            "&:active": {
              color: withThemeColor(8),
              backgroundColor: withThemeColor(4),
            },
            "&[data-active]": {
              color: withThemeColor(9),
              backgroundColor: withThemeColor(4),
              "&:hover": {
                backgroundColor: withThemeColor(4),
              },
              "&:active": {
                backgroundColor: withThemeColor(4),
              },
            },
          },
        };

        // @ts-ignore
        const matchedStyle = rootStyles[props.variant] || {};

        return {
          root: {
            ...matchedStyle,
            borderRadius: theme.defaultRadius,
            transition: "background 150ms ease-in-out",
          },
          section: {
            marginRight: 10,
          },
        };
      },
    },
    Stepper: {
      styles: (theme: MantineTheme, props: StepperProps) => {
        const color = props.color || theme.primaryColor;
        return {
          stepIcon: {
            backgroundColor: themeColor(theme, color, 0),
            borderColor: themeColor(theme, color, 4),
            color: themeColor(theme, color, 7),
            "&[data-progress]": {
              backgroundColor: themeColor(theme, color, 9),
              color: themeColor(theme, color, 0),
              borderColor: themeColor(theme, color, 9),
            },
            "&[data-completed]": {
              backgroundColor: themeColor(theme, color, 3),
              color: themeColor(theme, color, 9),
              borderColor: themeColor(theme, color, 9),
            },
          },
          stepCompletedIcon: {
            color: themeColor(theme, color, 9),
            "& > svg": {
              width: "14px !important",
              height: "14px !important",
            },
          },
          separator: {
            backgroundColor: themeColor(theme, color, 4),
          },
          separatorActive: {
            backgroundColor: themeColor(theme, color, 9),
          },
          verticalSeparator: {
            backgroundColor: themeColor(theme, color, 4),
          },
          verticalSeparatorActive: {
            backgroundColor: themeColor(theme, color, 9),
          },
        };
      },
    },
    Alert: {
      defaultProps: {
        color: "peacock",
      },
      styles: (theme: MantineTheme, props: AlertProps) => {
        const color = props.color || theme.primaryColor;
        return {
          root: {
            borderRadius: 0,
            border: "none",
            borderLeft: `2px solid ${themeColor(theme, color, 7)}`,
            color: themeColor(theme, color, 9),
            backgroundColor: themeColor(theme, color, 1),
          },
          title: {
            color: "inherit",
          },
          icon: {
            color: "inherit",
            marginRight: 4,
          },
          message: {
            color: "inherit",
          },
        };
      },
    },
    Select: {
      defaultProps: {
        transition: "fade",
        transitionDuration: 200,
        transitionTimingFunction: "ease",
        size: "md",
        withCheckIcon: false,
      },
      styles: (theme: MantineTheme, props: SelectProps) => {
        const styles = getInputStyles(theme, { size: props.size });
        const height = styles.input.height;

        return {
          label: {
            lineHeight: "20px",
            marginBottom: 6,
          },
          description: {
            color: themeColor(theme, "carbon", 7),
          },
          input: {
            height: height,
            minHeight: height,
            color: themeColor(theme, "carbon", 8),

            ...(props.variant === "unstyled" && {
              border: "none",
              "&:disabled": {
                color: themeColor(theme, "carbon", 7),
              },
            }),
            ...(props.variant === "filled" && {
              backgroundColor: themeColor(theme, "carbon", 2),
              borderColor: "transparent",

              "&:disabled": {
                color: themeColor(theme, "carbon", 6),
                cursor: "not-allowed",
              },
            }),
          },
          option: {
            transition: "background 150ms ease-in-out",
            color: themeColor(theme, "carbon", 8),
            "&:hover": {
              color: themeColor(theme, "carbon", 8),
              backgroundColor: themeColor(theme, "carbon", 3),
            },
            "&[data-checked]": {
              color: themeColor(theme, "carbon", 8),
              fontWeight: 700,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: themeColor(theme, "carbon", 3),
              },
            },
          },
          section: {
            "& > svg": {
              color: `${themeColor(theme, "carbon", 7)} !important`,
            },
          },
        };
      },
    },
    MultiSelect: {
      defaultProps: {
        size: "md",
        transition: "fade",
        transitionDuration: 200,
        transitionTimingFunction: "ease",
        withCheckIcon: false,
      },
      styles: (theme: MantineTheme, props: MultiSelectProps) => {
        const styles = getInputStyles(theme, { size: props.size });
        const inputHeight = styles.input.height;
        return {
          label: {
            fontSize: 14,
            marginBottom: 6,
          },
          input: {
            paddingTop: 8,
            paddingBottom: 8,
          },
          inputField: {
            "&::placeholder": {
              color: themeColor(theme, "carbon", 6),
            },
          },
          wrapper: {
            height: inputHeight + 2,
          },
          pill: {
            backgroundColor: themeColor(theme, "carbon", 3),
            color: themeColor(theme, "carbon", 8),
            borderRadius: theme.radius.sm,
          },
          section: {
            "& > svg": {
              color: `${themeColor(theme, "carbon", 7)} !important`,
            },
          },
        };
      },
    },
    Input: {
      defaultProps: {
        size: "md",
      },
      styles: getInputStyles,
    },
    TextInput: {
      defaultProps: {
        size: "md",
        inputWrapperOrder: ["label", "input", "description", "error"],
      },
      styles: getInputStyles,
    },
    PasswordInput: {
      defaultProps: {
        size: "md",
      },
      styles: getInputStyles,
    },
    NumberInput: {
      defaultProps: {
        size: "md",
      },
      styles: getInputStyles,
    },
    Textarea: {
      styles: (theme: MantineTheme, props: TextareaProps) => {
        const styles = getInputStyles(theme, props);
        styles.input.height = undefined;
        return styles;
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
  const systemColorScheme = useOperateSystemColorScheme();
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
              <Box
                component={IconTrash}
                c="red.7"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            <Text c="red.7">Delete my account</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}

function TestNavLinks() {
  return (
    <Card withBorder shadow="md">
      <h2>NavLink</h2>
      <Box>
        <NavLink label="Disabled" disabled />
        <NavLink
          label="With description"
          description="Additional information"
          leftSection={
            <Badge
              size="xs"
              variant="filled"
              color="red"
              sx={{
                width: 16,
                height: 16,
                padding: 0,
              }}
            >
              3
            </Badge>
          }
        />
        <NavLink label="Active subtle" variant="subtle" active />
        <NavLink label="Active light" active />
        <NavLink label="Active filled" variant="filled" active />
      </Box>
    </Card>
  );
}

function TestAlert() {
  return (
    <Card withBorder shadow="md">
      <h2>Alert</h2>

      <Alert variant="light" title="Alert title" icon={<IconInfoCircle />}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
        quae tempore necessitatibus placeat saepe.
      </Alert>
    </Card>
  );
}

function TestStepper() {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <Card withBorder shadow="md">
      <h2>Stepper</h2>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Create an account">
          Step 1 content: Create an account
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </Card>
  );
}

function TestInputAndSelect() {
  return (
    <Card withBorder shadow="md">
      <h2>Input and Select</h2>

      <Stack>
        <Input placeholder="Input" />
        <TextInput
          placeholder="TextInput"
          label="Name"
          description="Description"
          error="Error"
        />
        <TextInput placeholder="disabled TextInput" label="Name" disabled />
        <Select
          placeholder="Select"
          data={["Option 1", "Option 2", "Option 3"]}
        />
        <MultiSelect
          placeholder="MultiSelect"
          data={["Option 1", "Option 2", "Option 3"]}
        />
        <Textarea placeholder="Textarea" autosize rows={5} />
        <PasswordInput placeholder="PasswordInput" error="Error" />
        <NumberInput placeholder="NumberInput" />
      </Stack>
    </Card>
  );
}

function App() {
  const { setColorScheme } = useColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  console.log("computedColorScheme", computedColorScheme);

  const tabItems = [
    "buttons",
    "anchors",
    "skeletons",
    "tabs",
    "notifications",
    "menu",
    "navlinks",
    "stepper",
    "alert",
    "input-and-select",
  ];

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

      <Tabs defaultValue={tabItems.at(-1)} orientation="vertical">
        <Tabs.List>
          {tabItems.map((item) => {
            return (
              <Tabs.Tab key={item} value={item}>
                {item}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        <Tabs.Panel value="buttons" pl="md">
          <TestButtons />
        </Tabs.Panel>
        <Tabs.Panel value="anchors" pl="md">
          <TestAnchors />
        </Tabs.Panel>
        <Tabs.Panel value="skeletons" pl="md">
          <TestSkeletons />
        </Tabs.Panel>
        <Tabs.Panel value="tabs" pl="md">
          <TestTabs />
        </Tabs.Panel>
        <Tabs.Panel value="notifications" pl="md">
          <TestNotifications />
        </Tabs.Panel>
        <Tabs.Panel value="menu" pl="md">
          <TestMenu />
        </Tabs.Panel>
        <Tabs.Panel value="navlinks" pl="md">
          <TestNavLinks />
        </Tabs.Panel>
        <Tabs.Panel value="stepper" pl="md">
          <TestStepper />
        </Tabs.Panel>
        <Tabs.Panel value="alert" pl="md">
          <TestAlert />
        </Tabs.Panel>
        <Tabs.Panel value="input-and-select" pl="md">
          <TestInputAndSelect />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <App />
  </Provider>,
);
