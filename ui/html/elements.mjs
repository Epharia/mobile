export function create(e, ...classList) {
    const element = globalThis.document.createElement(`${e}`);
    if (classList.length > 0) element.classList.add(...classList);
    return element;
}

export function button(text = "", onClick) {
    const button = create('button');
    button.innerHTML = text;
    button.addEventListener('click', onClick);
    return button;
}

export function header(text) {
    const header = create('div', 'header');
    const title = create('h1');
    title.innerHTML = text;
    header.appendChild(title);
    return header;
}