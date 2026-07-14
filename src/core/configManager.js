import fs from "fs";

export class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = {};
  }

  load() {
    const raw = fs.readFileSync(this.configPath, "utf8");
    this.config = JSON.parse(raw);
    return this.config;
  }

  save() {
    fs.writeFileSync(
      this.configPath,
      JSON.stringify(this.config, null, 2)
    );
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
  }
}