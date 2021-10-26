const navBar = document.querySelector('nav .nav_links');
const hamBtn = document.querySelector('.menu_btn');

hamBtn.addEventListener('click',() => {
  hamBtn.classList.toggle('hamAnimation');
  navBar.classList.toggle('show');
})


// ////////////////// shorten form
const urlList = document.querySelector('.list');
const submitButton = document.querySelector('.btn_submit');
const form = document.querySelector('.shorten form');
const loadIcon = document.querySelector('.loading_icon');
const errorMessage = document.querySelector('#error_message');

form.addEventListener('submit',(e) => {
  e.preventDefault();
  const inputValue = document.querySelector('.input_box input');

  if(inputValue.value == null || inputValue.value === ''){
      form.classList.add('error');
      return;
  };

  loadIcon.classList.remove('hidden');
  form.classList.remove('error');

  setTimeout(() => {
    fetch('https://api.shrtco.de/v2/shorten?url='+inputValue.value)
    .then((result) => result.json())
    .then((data) => {
      if (data.ok === false) {
        form.classList.add('error');
        errorMessage.innerText = 'Link is not valid';
      }else{
        addListCard(inputValue.value, data.result.short_link);
        inputValue.value = '';
        save();
      }
      loadIcon.classList.add('hidden');
    });
  },500);
});

function addListCard(myLink, shortLink){
  const urlCard = document.createElement('div');
  urlCard.classList.add('list_card');
  const userLink = myLink.length > 30 ? myLink.substr(0,30)+ '...' : myLink;
  urlCard.innerHTML = `
  <p class="full_link">${userLink}</p>
  <div class="short_link_wrapper">
    <p class="short_link">${shortLink}</p>
    <div class="buttons">
      <button class="del" onCLick="delCard(this)">Delete</button>
      <button class="copy" onClick="copyLink(this)">Copy</button>
    </div>
  </div>
  `;

  urlList.appendChild(urlCard);
};


window.onload = function() {
  elements = JSON.parse(localStorage.getItem('shorten_list'));
  urlList.innerHTML = elements;
};

function save(){
  elements = urlList.innerHTML;
  localStorage.setItem('shorten_list', JSON.stringify(elements));
};

function copyLink(button){
  const shrtLink = button.parentElement.previousElementSibling.innerHTML;
  navigator.clipboard.writeText(shrtLink);
  button.classList.add('copied');
  button.innerHTML = 'Copied';
  setTimeout(() =>{
      button.classList.remove('copied')
      button.innerHTML = 'Copy'
  }, 2000)
};

function delCard(button){
  urlList.removeChild(button.parentElement.parentElement.parentElement);
  save();
};