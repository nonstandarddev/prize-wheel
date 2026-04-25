/*
    1: Constants & helpers
*/

// Constants

const OPTIONS = [
  "10% Off",
  "It's Free!",
  "Not Your Day",
  "Bad Luck"
];
const OPTION_COLOURS = ["#ad0040ff", "#e77ba3"];

// Helpers

const STEP_PCT = (1 / OPTIONS.length) * 100;
const STEP_DEG = 360 / OPTIONS.length;
const OPTION_MAPPING = () => {
  const mapping = new Map();
  OPTIONS.forEach((option, i) => {
    mapping.set([i * STEP_DEG, (i + 1) * STEP_DEG], option);
  });

  return mapping;
};

/* 
    2: State
    
    NB: may be defined in one or more variables
*/
const state = {
  rotation: {
    position: 0,
    ranges: OPTION_MAPPING(),
  },
};

/* 
    3: State Manipulation (Accessors)

    NB: includes the 'getters' and 'setters' associated with backend services
*/

// Setters

const setRotationPosition = () => {
  if (state.rotation.position === 0) {
    const end = Math.floor(Math.random() * 360);
    state.rotation.position = end;
  } else {
    state.rotation.position = 0;
  }
};

// Getters

const getRotationPosition = () => state.rotation.position;
const getRotationResult = (endState) => {
  const ranges = state.rotation.ranges;
  let selectedOption = null;
  ranges.keys().forEach((range) => {
    const lower = range[0];
    const upper = range[1];
    endStateAC = 360 - endState;
    if (endStateAC >= lower && endStateAC < upper) {
      selectedOption = ranges.get(range);
    }
  });
  return selectedOption;
};

/*
    4: DOM References

*/

const DOM = {
  wheel: document.querySelector(".wheel"),
  spin: document.querySelector(".spin"),
};

/* 
    5: DOM Updates (i.e. logic for 'modifying' the DOM in certain detailed ways)
*/

const spinWheel = (endState) => {
  // Apply `.rotating` class to trigger CSS animation
  DOM.wheel.classList.toggle("rotating");

  // Set CSS variables `--random-end-state` to stop the wheel at a 'random' orientation
  DOM.wheel.style.setProperty("--random-end-state", endState + "deg");
};

const initView = () => {
  let accum = 0;
  OPTIONS.forEach((option, i) => {
    const segment = document.createElement("li");
    segment.setAttribute("data-percentage", STEP_PCT);
    segment.setAttribute(
      "data-color",
      i % 2 === 0 ? OPTION_COLOURS[0] : OPTION_COLOURS[1],
    );
    segment.style.setProperty("--accum", accum);

    const alias = document.createElement("strong");
    alias.textContent = option;

    segment.appendChild(alias);
    DOM.wheel.appendChild(segment);

    accum += STEP_PCT;
  });
};

/*
    6: Event Handlers

    NB: these are called by event listeners that listen to DOM (and other events e.g. WebSockets)
*/

const onSpin = () => {
  // Update state
  setRotationPosition();
  const endState = getRotationPosition();
  // Update DOM
  spinWheel(endState);
  const endResult = getRotationResult(endState);
  console.log(endResult);
};

/*
    7: Event Bindings
*/
DOM.spin.onclick = () => onSpin();

/* 
    8: Initialisation
*/
initView();
