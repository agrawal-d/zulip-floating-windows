(() => {
  console.log("Zulip extension init");
  document.body.addEventListener("click", (e) => {
    const title = e.target.innerText.trim();
    if (e.altKey && e.target.classList.contains("message_label_clickable")) {
      e.preventDefault();
      e.stopPropagation();
      createFloatingWindow(e.target, title);
    }
  });

  let topMostZIndex = 10000;

  function enable_drag(frame) {
    // Frame is the window.
    dragElement(frame);

    function dragElement(frame) {
      console.log("Enabling drag");
      frame.addEventListener("mousedown", (e) => {
        frame.style.zIndex = topMostZIndex++;
        console.log(frame.childNodes[1]);
        frame.childNodes[1].style.display = "none";
      });

      frame.addEventListener("mouseup", (e) => {
        frame.childNodes[1].style.display = "block";
      });

      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
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
        frame.style.top =
          Math.max(
            Math.min(frame.offsetTop - pos2, window.innerHeight - 10),
            -20
          ) + "px";
        frame.style.left =
          Math.max(
            Math.min(frame.offsetLeft - pos1, window.innerWidth - 100),
            -30
          ) + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }

  function toggleMinimize(e) {
    console.log("MINTOGGLE");
    const btn = e.target;
    const fHeader = btn.parentElement.parentElement;
    const fWindow = fHeader.parentElement;
    if (fWindow.getAttribute("minimized") === "true") {
      fWindow.setAttribute("minimized", "false");
      e.target.innerHTML = "Minimize";
    } else {
      fWindow.setAttribute("minimized", "true");
      e.target.innerHTML = "Maximize";
    }
  }

  window.onload = () => {
    const fScript = document.createElement("script");
    fScript.innerText = tScript;
    document.body.appendChild(fScript);
  };

  function createFloatingWindow(stream, title) {
    if (title.length > 25) {
      title = title.substring(0, 21) + "...";
    }
    console.log("Creating floating window", stream);
    const fWindow = document.createElement("div");
    fWindow.setAttribute("minimized", "false");
    fWindow.classList.add("f-window");
    const fHeader = document.createElement("div");
    fHeader.classList.add("f-header");
    const minimizeButton = document.createElement("a");
    minimizeButton.innerHTML = "Minimize";
    minimizeButton.classList.add("f-a");
    minimizeButton.classList.add("float-right");
    minimizeButton.onclick = toggleMinimize;
    fHeader.innerHTML += `<div><b>${title || "Floating Narrow"} </b>\
        <a style="float:right;pa" class="f-a red" onclick="this.parentElement.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement.parentElement)">Close</a></div>`;
    fHeader.children[0].appendChild(minimizeButton);
    fWindow.appendChild(fHeader);
    const frame = document.createElement("iframe");
    frame.setAttribute("src", stream.href);
    // frame.setAttribute("src", "about:blank");
    console.log(stream.href, stream.innerText);
    frame.setAttribute("mozbrowser", "true");
    fWindow.appendChild(frame);
    document.body.appendChild(fWindow);
    frame.contentDocument?.body.classList.add("floating-zulip");
    const css = document.createElement("link");
    css.setAttribute(
      "href",
      browser.runtime.getURL("floating-window.css")
    );
    css.setAttribute("rel", "stylesheet");
    frame.style.opacity = 0;
    const loading = document.createElement("b");
    loading.classList.add("floating-loading");
    loading.innerHTML = "Loading";
    fWindow.appendChild(loading);
    console.log(css);
    frame.onload = () => {
      frame.style.opacity = 1;
      loading.style.display = "none";
      frame.contentDocument.head.appendChild(css);
      frame.contentDocument.body.classList.add("floating-zulip");
      console.log("Iframe loaded!");
    };
    frame.style.height = fWindow.offsetHeight - fHeader.offsetHeight + "px";
    console.log("Dragging!");
    enable_drag(fWindow);
  }
})();
