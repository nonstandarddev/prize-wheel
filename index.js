/*
    1: Constants & helpers
*/

/*
  - If they win, they can claim now or later (?) -> there will be a button; if they click
  'Claim Now' then they go to C100
*/

// Constants

const OPTION_CONFIG = {
  "It's Free!": 1,
  "Not Your Day": 0,
  "Bad Luck": 0,
  "10% Off": 1,
  "No Luck": 0,
  "No Prize": 0,
  "Jog On": 0,
  "Oh Dear": 0
};
const OPTIONS = Object.keys(OPTION_CONFIG);
const OPTION_COLOURS = ["#ad0040ff", "#e77ba3"];
const MSG_DELAY_MS = 8100;

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
  messageTimerId: null,
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
  message: document.querySelector(".message"),
  messageResult: document.querySelector(".result"),
  messageAction: document.querySelector(".action")
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

const flash = (endResult, delay = MSG_DELAY_MS) => {
  clearTimeout(state.messageTimerId);
  DOM.messageResult.textContent = "";
  DOM.messageAction.textContent = "";
  DOM.message.classList.remove("flash");
  DOM.message.setAttribute("aria-hidden", "true");

  state.messageTimerId = setTimeout(() => {
    const prize = OPTION_CONFIG[endResult];
    DOM.messageAction.textContent = prize ? "Collect your prize at stand C100!" : "Better luck next time!";
    DOM.messageResult.textContent = endResult;
    DOM.message.setAttribute("aria-hidden", "false");
    DOM.message.classList.add("flash");
  }, delay)
}; 

const resetMessage = () => {
  clearTimeout(state.messageTimerId);
  DOM.message.classList.remove("flash");
  DOM.message.setAttribute("aria-hidden", "true");
  DOM.messageResult.textContent = "";
  DOM.messageAction.textContent = "";
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
  const endResult = getRotationResult(endState);

  // Update DOM
  spinWheel(endState);
  flash(endResult);

};

/*
    7: Event Bindings
*/
DOM.spin.onclick = () => onSpin();
DOM.message.onclick = () => resetMessage();

/* 
    8: Initialisation
*/
initView();
