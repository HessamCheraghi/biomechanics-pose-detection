import React from "react";
import "./style.css";
import Webcam from "react-webcam";
import {
  AppShell,
  Burger,
  Checkbox,
  Footer,
  Header,
  MediaQuery,
  Navbar,
  Slider,
  Text,
  useMantineTheme,
  MantineProvider,
  createEmotionCache,
} from "@mantine/core";
import rtlPlugin from "stylis-plugin-rtl";
import { detect } from "./utils";
import MyFonts from "./Global";

const rtlCache = createEmotionCache({
  key: "mantine-rtl",
  stylisPlugins: [rtlPlugin],
});
const calculateInterval = (frames) => {
  if (frames === 0) return 1000;
  if (frames === 25) return 500;
  if (frames === 50) return 200;
  if (frames === 75) return 100;
  if (frames === 100) return 50;
  return 1000;
};

function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = React.useState(false);
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const calculationsRef = React.useRef(null);
  const [frames, setFrames] = React.useState(0);
  const [showDots, setShowDots] = React.useState(true);
  const [showLines, setShowLines] = React.useState(true);
  const [showAngles, setShowAngles] = React.useState(true);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      detect(webcamRef, canvasRef, calculationsRef, {
        showDots,
        showLines,
        showAngles,
      });
    }, calculateInterval(frames));

    return () => {
      clearInterval(intervalID);
    };
  }, [frames, showDots, showLines, showAngles]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      emotionCache={rtlCache}
      theme={{
        dir: "rtl",
        cursorType: "pointer",
        fontFamily: "Vazirmatn, sans-serif",
      }}
    >
      <MyFonts />
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
          >
            <Navbar.Section mt="xl">
              <Text>سرعت آپدیت کردن بر ثانیه</Text>
              <Slider
                value={frames}
                onChange={setFrames}
                label={null}
                step={25}
                marks={[
                  { value: 0, label: "fps 1" },
                  { value: 25, label: "fps 2" },
                  { value: 50, label: "fps 5" },
                  { value: 75, label: "fps 10" },
                  { value: 100, label: "fps 24" },
                ]}
              />
            </Navbar.Section>
            <Navbar.Section mt="xl" />
            <Navbar.Section mt="xl">
              <Checkbox
                label="نمایش نقاط"
                checked={showDots}
                onChange={(event) => setShowDots(event.currentTarget.checked)}
              />
            </Navbar.Section>
            <Navbar.Section mt="xl">
              <Checkbox
                label="نمایش خطوط"
                checked={showLines}
                onChange={(event) => setShowLines(event.currentTarget.checked)}
              />
            </Navbar.Section>
            <Navbar.Section mt="xl">
              <Checkbox
                label="نمایش زاویه ها"
                checked={showAngles}
                onChange={(event) => setShowAngles(event.currentTarget.checked)}
              />
            </Navbar.Section>
          </Navbar>
        }
        footer={
          <Footer p="md">
            <div className="result" ref={calculationsRef}>
              Loading...
            </div>
          </Footer>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md" width={{ base: 300 }}>
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>💪 Biomechanics Pose Detection 💪</Text>
            </div>
          </Header>
        }
      >
        <div className="view" dir="ltr">
          <Webcam ref={webcamRef} className="webcam" />
          <canvas ref={canvasRef} className="canvas" />
        </div>
      </AppShell>
    </MantineProvider>
  );
}
export default App;
