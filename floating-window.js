console.log("Zulip extension working");
const messageHeader = document.getElementsByClassName("message-header-contents")[0];
const stream = messageHeader.children[0];
const btn = document.createElement("button");
btn.addEventListener("click", (e) => { e.preventDefault(); createFloatingWindow(stream) });
btn.innerHTML = "Floating Window";
messageHeader.appendChild(btn);

const enable_drag = (frame) => {
    let topMostZIndex = 10000;
    dragElement(frame);

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
}

function createFloatingWindow(stream) {
    console.log("Creating floating window", stream);
    const fWindow = document.createElement("div");
    fWindow.classList.add("f-window")
    const fHeader = document.createElement("div");
    fHeader.classList.add("f-header");
    fWindow.appendChild(fHeader);
    const frame = document.createElement("iframe");
    frame.setAttribute("src", stream.href);
    frame.setAttribute("mozbrowser", "true");
    fWindow.appendChild(frame);
    document.body.appendChild(fWindow);
    frame.contentDocument.body.classList.add("floating-zulip");
    const css = document.createElement("link");
    css.setAttribute("href", browser.runtime.getURL("floating-window.css"));
    css.setAttribute("rel", "stylesheet");
    frame.contentDocument.head.appendChild(css);
    frame.contentDocument.body.classList.add("floating-zulip");
    enable_drag(fWindow);
}