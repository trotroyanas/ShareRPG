const classChildren = x => document.getElementsByClassName(`navbar-${x}`)[0];
classChildren('toggle').addEventListener('click', () => {
    classChildren('collapse').classList.toggle('collapse');
}, false);