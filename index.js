/*
    1: Constants & helpers
*/

/* 
    2: State
    
    NB: may be defined in one or more variables
*/
let state = {
  rotation: {
    count: 0,
    position: null
  }
};

/* 
    3: State Manipulation (Accessors)

    NB: includes the 'getters' and 'setters' associated with backend services
*/

// Setters
let setRotationCount = () => state.rotation.count += 1;
let setRotationEndState = () => {
    const end = Math.floor(Math.random() * 360) + "deg";
    state.rotation.position = end;
}

// Getters
let isRotated = () => state.rotation.count > 0;
let getRotationEndState = () => state.rotation.position;

/*
    4: DOM References

*/

let D = document;

// DOM nodes (individual)
let $wheel = D.getElementById("wheel");
let $spin = D.getElementById("spin");

/* 
    5: DOM Updates (i.e. logic for 'modifying' the DOM in certain detailed ways)
*/

let spinWheel = () => {
  $wheel.classList.toggle("rotating");
  $wheel.style.setProperty("--random-end-state", getRotationEndState());
};

/*
    6: Event Handlers

    NB: these are called by event listeners that listen to DOM (and other events e.g. WebSockets)
*/

let onSpin = () => {
  // Update state
  setRotationCount();
  setRotationEndState();
  // Update DOM
  spinWheel();
};

/*
    7: Event Bindings
*/
$spin.onclick = () => onSpin();
