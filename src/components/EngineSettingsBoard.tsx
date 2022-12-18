import {
  ActionIcon,
  Collapse,
  Grid,
  Group,
  Stack,
  Switch,
  Text
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons";
import { useEffect, useState } from "react";
import {
  Engine,
  EngineStatus,
  getDefaultEngines,
  getEngines
} from "../utils/engines";
import DepthSlider from "./DepthSlider";
import ImageCheckbox from "./ImageCheckbox";
import LinesSlider from "./LinesSlider";

function EngineSettingsBoard({
  selectedEngines,
  setSelectedEngines,
  engineOn,
  setEngineOn,
  numberLines,
  setNumberLines,
  maxDepth,
  setMaxDepth,
}: {
  selectedEngines: Engine[];
  setSelectedEngines: React.Dispatch<React.SetStateAction<Engine[]>>;
  engineOn: boolean;
  setEngineOn: React.Dispatch<React.SetStateAction<boolean>>;
  numberLines: number;
  setNumberLines: React.Dispatch<React.SetStateAction<number>>;
  maxDepth: number;
  setMaxDepth: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [engines, setEngines] = useState<Engine[]>(getDefaultEngines());
  const [showSettings, toggleShowSettings] = useToggle();

  useEffect(() => {
    getEngines().then((engines) => {
      setEngines(engines);
    });
  }, []);
  return (
    <>
      <Group position="apart">
        <Group>
          <Switch
            checked={engineOn}
            onChange={(event) => setEngineOn(event.currentTarget.checked)}
            onLabel="On"
            offLabel="Off"
            size="lg"
            disabled={selectedEngines.length === 0}
          />
          {selectedEngines.length === 0 && (
            <Text color="red">No engines selected</Text>
          )}
        </Group>

        <ActionIcon
          onClick={() => {
            toggleShowSettings();
          }}
        >
          <IconSettings />
        </ActionIcon>
      </Group>
      <Collapse in={showSettings}>
        <Stack spacing="xl">
          <div>
            <Text size="sm">Engine Depth</Text>
            <DepthSlider value={maxDepth} setValue={setMaxDepth} />
          </div>
          <div>
            <Text size="sm">Number of lines</Text>
            <LinesSlider value={numberLines} setValue={setNumberLines} />
          </div>

          <Grid grow>
            {engines
              .filter((engine) => engine.status === EngineStatus.Installed)
              .map((engine) => (
                <Grid.Col span={4} key={engine.name}>
                  <ImageCheckbox
                    title={engine.name}
                    image={engine.image}
                    checked={selectedEngines.some(
                      (selectedEngine) => selectedEngine.name === engine.name
                    )}
                    onChange={(checked) => {
                      if (checked) {
                        setSelectedEngines((engines: Engine[]) => [
                          ...engines,
                          engine,
                        ]);
                      } else {
                        setSelectedEngines((engines) =>
                          engines.filter((e) => e.name !== engine.name)
                        );
                      }
                    }}
                  />
                </Grid.Col>
              ))}
          </Grid>
        </Stack>
      </Collapse>
    </>
  );
}

export default EngineSettingsBoard;