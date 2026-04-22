/*
    1: Constants & helpers
*/
const LOADING = 0, READY = 1, ERROR = 2;

/* 
    2: State
    
    NB: may be defined in one or more variables
*/
let state = { 
    rotating: false
 };

/* 
    3: State Manipulation (Accessors)

    NB: includes the 'getters' and 'setters' associated with backend services
*/

// Setters
let setRotating = () => !state.rotating;

// Getters
let isRotating = () => state.rotating;

/*
    4: DOM References

*/

let D = document;

// DOM nodes (individual)
let $wheel = D.getElementById('wheel');
let $spin = D.getElementById('spin');

/* 
    5: DOM Updates (i.e. logic for 'modifying' the DOM in certain detailed ways)
*/

let toggleWheel = () => {
  $wheel.classList.toggle('rotating');
};

/*
    6: Event Handlers

    NB: these are called by event listeners that listen to DOM (and other events e.g. WebSockets)
*/

let onSpin = () => {
    setRotating();
    toggleWheel();
};

/*
    7: Event Bindings
*/
$spin.onclick = () => onSpin();
