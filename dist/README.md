# Untimely

![Untimely Grafana Panel Screenshot](https://www.factry.io/blog/introducing-the-untimely-grafana-panel/panel.png "Untimely Grafana Panel Screenshot")

## Introduction
The Untimely Grafana plugin is a panel that facilitates working with distances on the x-axis (or anything else that isn't time).

You add queries to your visualization, then select the query that represents the x-axis. The different series will then be interlinked
based on their timestamps.

It's based on the Grafana React example using Typescript.

## Features

- Resets: whenever the x-axis value resets, dropping below a previous value, the graph values keep going
- Legend: the panel has a simple legend, similar looking to the default Grafana legend
- Tooltip: the panel has a simple tooltip, supporting multiple series, similar to the default Grafana tooltip
- Offset: when the x-values have a certain offset, you can define this

## Installation
To install the plugin:

- First build the plugin (`yarn build`)
- Rename the `dist/` folder to a nicer name, identifying it in the plugin directory
- Copy that directory to `/var/lib/grafana/plugins` in your Grafana installation
- Restart the grafana server (`sudo systemctl restart grafana-server`)

## Usage and tips
- Use the decimal formatting to choose how many decimals should be in the ticks and on the tooltip
- When you have resets, choose the 'max' selector for your x-axis series and the 'min' selector for the other series
- A little downwards arrow next to a value denotes that there is a reset
- Use fill (none) to fill up missing values for the group by

## Development
Make **sure** you are running Node 12

First, install dependencies:
```
yarn install --pure-lockfile
```

To work with this plugin run:
```
yarn dev
```

or
```
yarn watch
```

This will run linting tools and apply prettier fix.


To build the plugin run:
```
yarn build
```
