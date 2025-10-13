// For typing animation on your name (optional)
const nameElement = document.querySelector('.animated-name');
const nameText = nameElement.textContent;
nameElement.textContent = '';

let i = 0;
function typeName() {
  if (i < nameText.length) {
    nameElement.textContent += nameText.charAt(i);
    i++;
    setTimeout(typeName, 150);
  }
}
typeName();
