export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

export async function loadHeaderFooter(){
    const templateHeader = await loadTemplate("/partials/header.html");
    const templateFooter = await loadTemplate("/partials/footer.html");

    const header = document.querySelector("#dynamic-header");
    const footer = document.querySelector("#dynamic-footer");
    

    renderWithTemplate(templateHeader, header, null);
    renderWithTemplate(templateFooter, footer);
        
    const year = document.querySelector("#current-year");
    year.textContent = new Date().getFullYear();

}