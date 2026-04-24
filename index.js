/*
    1: Constants & helpers
*/
const OPTIONS = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4'
];

const initOptionMapping = () => {

    const step = (360 / OPTIONS.length);

    const mapping = new Map();
    OPTIONS.forEach((option, i) => {
        mapping.set([i * step, (i + 1) * step], option)
    });

    return mapping;
};

/* 
    2: State
    
    NB: may be defined in one or more variables
*/
let state = {
  rotation: {
    position: "0deg",
    mapping: initOptionMapping()
  }
};

/* 
    3: State Manipulation (Accessors)

    NB: includes the 'getters' and 'setters' associated with backend services
*/

// Setters
let setRotationPosition = () => {

    if (state.rotation.position === "0deg") {
        const end = Math.floor(Math.random() * 360) + "deg";
        state.rotation.position = end;
    } else {
        state.rotation.position = "0deg";
    };
    
};

// Getters
let getRotationPosition = () => state.rotation.position;

/*
    4: DOM References

*/

const DOM = {
    wheel: document.querySelector(".wheel"),
    segments: document.querySelectorAll(".wheel li"),
    spin: document.querySelector(".spin")
};

/* 
    5: DOM Updates (i.e. logic for 'modifying' the DOM in certain detailed ways)
*/

const spinWheel = () => {

  // Apply `.rotating` class to trigger CSS animation
  DOM.wheel.classList.toggle("rotating");

  // Set CSS variables `--random-end-state` to stop the wheel at a 'random' orientation
  const endState = getRotationPosition();
  DOM.wheel.style.setProperty("--random-end-state", endState);

};

const initView = () => {
  let accum = 0;
  DOM.segments.forEach((segment) => {
    segment.style.setProperty("--accum", accum);
    accum += parseFloat(segment.getAttribute("data-percentage"));
  });
};

/*
    6: Event Handlers

    NB: these are called by event listeners that listen to DOM (and other events e.g. WebSockets)
*/

const onSpin = () => {

  // Update state
  setRotationPosition();

  // Update DOM
  spinWheel();

};

const onLoad = () => {

};

/*
    7: Event Bindings
*/
DOM.spin.onclick = () => onSpin();

/* 
    8: Initialisation
*/
initView();
