console.log("Zulip extension working", window, document);

const stream = document.getElementsByClassName("floating_recipient")[0];
console.log(stream);
const btn = document.createElement("button");
btn.addEventListener("click", createFloatingWindow);
btn.innerHTML = "Floating Window";
console.log(stream, btn);
stream.appendChild(btn);
console.log(stream, btn);

(() => {
    const frames = document.getElementsByClassName("window");
    let topMostZIndex = 1;
    console.log(frames);
    for (let frame of frames) {
        dragElement(frame);

    }

    function dragElement(frame) {


        frame.addEventListener("mousedown", (e) => frame.style.zIndex = topMostZIndex++);

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        frame.children[0].onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            frame.style.zIndex = topMostZIndex++;
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            frame.style.top = Math.max(Math.min((frame.offsetTop - pos2), window.innerHeight - 50), -250) + "px";
            frame.style.left = Math.max(Math.min((frame.offsetLeft - pos1), window.innerWidth - 100), -250) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();


function createFloatingWindow() {
    console.log("Creating floating window");
    const floating_window = `<div class"f-window" ><div class="f-header"></div><h3>Hello World</h3></div>`
    document.body.innerHTML += floating_window;
}