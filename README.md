# MVP JQuery range slider

![slider](./app/src/assets/readme/logo.png)

## Description

---

It's slider plugin using MVP pattern. It also contains script for connecting to JQuery.

## Demo

---

![colorpicker](./app/src/assets/readme/colorpicker.gif)
![dates](./app/src/assets/readme/dates.gif)
![config](./app/src/assets/readme/config.gif)

[The result is here](https://jq-range-slider.herokuapp.com/).

## Usage

### Options

```ts
const options = {
  intervals?: { // min, max and intermediate values, default is { min: -100, max: 100 }
     [key: string]: number; // only "<number>%" key is accepted, number should be > 0 && < 100
        min: number;
        max: number;
  }
  start?: number | number[]; // start values of handles, default is [0]
  steps?: number | "none" | (number | "none")[]; // steps for each interval, default is [none]
  connect?: boolean | boolean[]; // bar between two handles or border of track, default is [false,false]
  orientation?: "horizontal" | "vertical"; // orientation of slider, default is "horizontal"
  padding?: number | [number, number]; // padding for value on track (actual value can't be more than intervals.max - padding[1] and less than intervals.min + padding[0]), default is [0,0]
  formatter?: (value: number) => string; // formatter for tooltips and pips, default is (value: number) => value.toFixed(2).toLocaleString()
  tooltips?: boolean | (boolean | (value: number) => string)[]; // presentation of tooltips, default is [true], P.S.: overrides formatter
  pips?: { // default is {mode: "intervals", values: [-100, 100], density: 1, isHidden: false}
     // "intervals" - values are displayed for each interval, pips.values doesn't matter
     // "count"     - pips.values assign amount of displayed values
     // "positions" - pips.values assign percentages
     // "values"    - pips.values assign track values
     mode?: "intervals" | "count" | "positions" | "values"; // default is "intervals"
     values?: number | number[];
     density?: number; // density of pips between values (amount of pips for each css %), default is 1, max is 3
     isHidden?: boolean; // default is false
  }
};

// should to be created by yourself for your needs if you want slider with server connecting out of box
const facadeModel = {
   eventSource: new EventSource('/stateChanger'),
  //to be executed on "set" event of slider
  async setState(state) {
    // example request
    await fetch("/fetch/post/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ mode: "set", state: JSON.stringify(state) }),
    });

    return this;
  },
  //to be executed by init of view
  async getState() {
    // example request
    const response = await fetch("/fetch/post/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ mode: "get" }),
    });

    const result = await response.json();

    return result;
  },
  // run callback(state) on each message from server
  whenStateIsChanged(callback) {
    this.eventSource.onmessage = function (event) {
      callback(JSON.parse(event.data).state);
    };
  },
  // close connections if new model is assigned
  closeConnections() {
    this.eventSource.onmessage = null;

    return this;
  },
};
```

### API (also you can just add [types](./app/dist/types/) folder if your editor supports d.ts files)

```ts
getOptions(): {
  intervals: { [key: string]: number; min: number; max: number; };
  start: number[];
  steps: (number | "none")[];
  connect: boolean[];
  orientation: "horizontal" | "vertical"
  padding: [number, number];
  formatter: (value: number) => string;
  tooltips: (boolean | Formatter)[];
  pips: {
    mode: "intervals" | "count" | "positions" | "values";
    values: number | number[];
    density: number;
    isHidden: boolean;
  }
};

// to do reset pass undefined
setOptions(options?: {
  intervals: { [key: string]: number; min: number; max: number; }
  start: number | number[]
  steps: number | "none" | (number | "none")[]
  connect: boolean | boolean[]
  orientation: "horizontal" | "vertical"
  padding: number | [number, number]
  formatter: (value: number) => string
  tooltips: boolean | (boolean | Formatter
  pips: {
    mode: "intervals" | "count" | "positions" | "values";
    values: number | number[];
    density: number;
    isHidden: boolean;
  }
}): this;

// see options
setFacadeModel(facadeModel): Promise<{ value: number[] }>;

get(): number[];
// to do reset pass undefined
set(value?: number | number[]): this;

// eventName -> handler args:
// start: { thumbIndex: number };
// slide: { thumbIndex: number; newValue: number }; // newValue isn't validated
// update: {};
// change: {};
// set: {};
// end: { thumbIndex: number };
// render: {};
// response: { value: number[] };
on(eventName: "start" | "slide" | "update" | "change" | "set" | "end" | "render" | "response", handler: ((...args:any) => void) | { handleEvent(...args:any): void; }): this;
off(eventName: "start" | "slide" | "update" | "change" | "set" | "end" | "render" | "response", handler: ((...args:any) => void) | { handleEvent(...args:any): void; }): this;

remove(): this;
```

### Native js

Plug in:

```html
<link rel="stylesheet" href="range-slider.css" />
<script src="range-slider-plugin.js" defer="defer"></script>
```

Init:

```js
new window.RangeSliderPresenter(
  document.querySelector('.slider-container'),
  { options, facadeModel } // it's optional
);
```

### JQuery

Plug in:

```html
<link rel="stylesheet" href="range-slider.css" />
<script
  src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
  crossorigin="anonymous"
  defer="defer"
></script>
<script src="range-slider-plugin.js" defer="defer"></script>
<script src="jq-range-slider-plugin.js" defer="defer"></script>
```

init:

```js
const sliders = $('.slider-container').initRangeSlider(
  options, // it's optional
  facadeModel // it's optional
);
```

## Contribution

---

### What do you need to start

1. Package manager [NPM](https://www.npmjs.com/) and [NodeJs](https://nodejs.org/en/) platform.
2. Some CLI to execute commands from directory of your project (bash is recommended).
3. Clean VS Code editor(optional).

### Installation

```bash
git clone https://github.com/NZMinusDev/jq-range-slider.git
cd jq-range-slider
npm i
```

### Managing

In [package.json](./package.json) you can find useful scripts for managing the project. To run script, use the following command:

```bash
npm run {script-name}
```

Script-names:

- **start** - builds bundles and runs servers: webpack-dev-server and server with express;
- **dev** - just builds bundles and place it into [public](./app/public) directory;
- **build** - build minify bundles and place it into [public](./app/public) directory, also copies [server package.json](./server/package.json) and [server index.mjs](./server/index.mjs) files;
- **build:plugin** - build minify bundles for plugin only and place it into [dist](./app/dist) directory + run _types_ script;
- **types** - generate d.ts files and place it into [dist/types](./app/dist/types) directory;
- **UML** - generate .puml files and place it into [src](./app/src/plugin/UML/) directory. P.S.: you should work [with your hands](https://plantuml.com/en/class-diagram) a little cause of the [tool](https://github.com/bafolts/tplant) has bugs(["default" isn't keyword](https://github.com/bafolts/tplant/issues/66), [error when output directory doesn't exist](https://github.com/bafolts/tplant/issues/51), [Missing Aggregation/Composition](https://github.com/bafolts/tplant/issues/48), etc). Tip: you should manually copy tsconfig.json into root folder with appropriate edits of paths for each run cause of aliases and stuff don't work properly like as [-p flag](https://github.com/bafolts/tplant#-p---project-) doesn't;
- **test** - run jest tests(matches .spec. or .test. files), P.S.: it can work in a separate console in parallel with **start** script;
- **analyze** - visualize size of webpack output files with an interactive zoomable treemap using webpack-bundle-analyzer;
- **lint** - lint styles and scripts, show result;
- **lint:fix** - use prettier for all known files, lint styles and scripts, auto fix files with errors if it is possible, show result.
- **deploy** - pushes [public](./app/public/) to origin/gh-pages which is hooked by heroku.

### Technologies

- [Shared vs code settings](./.vscode/settings.json);
- vs code extensions which increase comfort:
  - [required](./.vscode/extensions.json);
  - optional:
    - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens);
    - [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph);
    - [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github);
    - [PowerShell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell);
    - [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
    - [Ayu](https://marketplace.visualstudio.com/items?itemName=teabyii.ayu);
    - [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme);
    - [Auto Complete Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-complete-tag);
    - [CSS Peek](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek);
    - [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion);
    - [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)
    - [vscode-sassdoc](https://marketplace.visualstudio.com/items?itemName=rafikis75.vscode-sassdoc);
    - [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer);
    - [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow);
    - [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost);
    - [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets);
    - [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg);
    - [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview);
    - [Change-Case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case);
    - [Sort Lines by Selection](https://marketplace.visualstudio.com/items?itemName=earshinov.sort-lines-by-selection);
    - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer);
    - [Webpack Snippets](https://marketplace.visualstudio.com/items?itemName=gogocrow.webpack-snippets);
    - [Russian Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ru).
- preprocessors which speed up work:
  - [Pug](https://pugjs.org/api/getting-started.html);
  - [scss](https://sass-lang.com/);
  - [typescript](https://www.typescriptlang.org/).
- [webpack](https://v4.webpack.js.org/concepts/) which kill your headaches:
  - You can simply import files at the entry point([dev](./app/src/pages/index/index.ts) or [build](./app/src/plugin/range-slider-plugin.ts)) instead of manually connecting them using tags on the page;
  - [pages](./app/src/pages/) only need to be created, and the collector can determine the entry points on its own;
  - no need to remember a bunch of css prefixes and what properties are supported thanks to [postCSS preset env](https://github.com/csstools/postcss-preset-env) and [autoprefixer](https://www.npmjs.com/package/autoprefixer);
  - output files is minified in production mode;
  - there is no need to write relative paths for import when there are [excellent aliases](./configs/webpack/webpack.config.js) for the most popular paths in development;
  - during development, when changing files, the result is immediately visible without manual reboots and builds;
  - during the build, webpack will notify you if: there are circular dependencies, libraries of different versions are connected, there are unused files, there are css properties that browsers do not support. Displays the speed of source processing at each stage of the build;
  - it should work the same on different platforms.
- [stylelint](https://stylelint.io/) based on [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) with [stylelint-order](https://github.com/hudochenkov/stylelint-order) and [stylelint-scss](https://github.com/kristerkari/stylelint-scss);
- [eslinter](https://eslint.org/) based on [Airbnb standarts](https://github.com/airbnb/javascript) integrated with prettier and typescript which protects your knee from :gun: and your life from wasting :clock2:;
- [jest](https://jestjs.io/): delightful javascript testing framework with a focus on simplicity, it works fine with typescript;
- pre-installed libraries:
  - [JQuery](https://jquery.com/);
  - [lodash-es](https://lodash.com/) to supplement the js standard. Tip: you should use only import of lodash-es(moreover, when importing, only care about the readability and strictness of the code, and not the optimization of the weight) instead of common lodash because ES6+ module syntax is supported by terser for optimization;
  - [lit-html](https://lit-html.polymer-project.org/guide) to highlight html inside js/ts and only update the parts of the template that have changed since the last render.
- custom tools: pug, scss, ts [shortcuts](./app/src/shared/utils/);.

### How it works

#### Architecture

The project does not rely on external global dependencies. But if you need to use jQuery, then you must connect it higher in the code.

Project is builded on Model-View-Presenter pattern. This pattern allows you to get functionally meaningful modules loosely connected to each other and useful in themselves. The architecture is loosely coupled due to the abstract classes for model and view modules.

Modules:

- _model_: it knows nothing about either _view_ or _controller_ but can emits event with updated data for subscribers. It consists of _presentation model_ and _facade model_:
  - _presentation model_: it serves presentation options with local state and validates them(thick model with imperative code). Provides getter/setter methods for manipulation of options and state. It can accept _facade model_ and binds with this. It emits 'set'(if options/state is updated - actually by a user interaction) and 'response'(if _facade model_ received state) events;
  - _facade model_: it's for getting and setting data from your _domain model_(models the subject area and implements business logic).
- _view_: template of GUI - it converts data to display template and catches user actions when template is rendered. _View_ is passive(_controller_ provides data to _view_) and dumb(also known as thin: declarative presentation logic). The main display template consists of subviews templates that make up the general display template and gets the pieces of the general data necessary for operation when it is updated;
- _controller_(also known as _presenter_ here): the logic of translating _view_ events (user interactions) into _model_ methods and _model_ events (after validation, server response, manual calls from code) to the rendering of _view_ - if necessary it converts view data to model data and model data to view data. It knows about _view_ and _model_ thanks to their abstract classes.

The loop of the simplest data exchange:

user interacts -> view emit event with desired data of state to display -> presenter gets view's event and calls model setState method, also model can be updated from code -> model updates it's state with validation and emits event with new state -> presenter gets model's event (after manual model updating or after server's state changing) and supplies data to view and gets view's template to rerendering.

#### Class diagram

![UML View Class Diagram](./app/src/plugin/UML/UML.svg)

## License

This project is licensed under the terms of the [MIT license](LICENSE).
