const cars = [
  {name:'Renault Clio',category:'Citadine',price:300,gear:'Manuelle',fuel:'Diesel',seats:5,image:'photo-1549317661-bd32c8ce0db2'},
  {name:'Dacia Sandero',category:'Citadine',price:250,gear:'Manuelle',fuel:'Essence',seats:5,image:'photo-1503376780353-7e6692767b70'},
  {name:'Peugeot 208',category:'Citadine',price:350,gear:'Automatique',fuel:'Essence',seats:5,image:'photo-1533473359331-0135ef1b58bf'},
  {name:'Hyundai Tucson',category:'SUV',price:650,gear:'Automatique',fuel:'Diesel',seats:5,image:'photo-1519641471654-76ce0107ad1b'},
  {name:'Volkswagen Golf',category:'Berline',price:500,gear:'Automatique',fuel:'Diesel',seats:5,image:'photo-1533106418989-88406c7cc8ca'},
  {name:'Dacia Duster',category:'SUV',price:450,gear:'Manuelle',fuel:'Diesel',seats:5,image:'photo-1519600297377-8b2b0a7e6e8d'}
];
let category = 'all';
let selectedCar;
const grid = document.querySelector('#car-grid');
function renderCars(){
  const term=document.querySelector('#search').value.trim().toLocaleLowerCase('fr');
  const visible=cars.filter(car=>(category==='all'||car.category===category)&&car.name.toLocaleLowerCase('fr').includes(term));
  grid.innerHTML=visible.map(car=>`<article class="car-card"><div class="car-photo"><img src="https://images.unsplash.com/${car.image}?auto=format&fit=crop&w=700&q=80" alt="Photo d’ambiance automobile, illustration non contractuelle" loading="lazy"><span class="category-tag">${car.category.toUpperCase()}</span></div><div class="car-body"><div class="car-title"><h3>${car.name}</h3><span>OU SIMILAIRE</span></div><div class="specs"><span>◉ ${car.gear}</span><span>◇ ${car.fuel}</span><span>♙ ${car.seats} places</span></div><div class="car-bottom"><div class="price">${car.price} <small>MAD / jour*</small></div><button class="car-book" data-car="${car.name}" aria-label="Préparer une demande pour ${car.name}">Choisir ↗</button></div></div></article>`).join('');
  document.querySelector('#empty-state').hidden=visible.length>0;
}
document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
const toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>{const open=document.querySelector('nav').classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('nav').classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
if(grid){
  renderCars();
  document.querySelector('#search').addEventListener('input',renderCars);
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;document.querySelectorAll('.filter').forEach(other=>{other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));});renderCars();}));
  const dialog=document.querySelector('#booking-dialog');
  const start=document.querySelector('#start-date');
  const end=document.querySelector('#end-date');
  const dateString=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  start.min=dateString(new Date());end.min=start.min;
  start.addEventListener('change',()=>{end.min=start.value||start.min;if(end.value&&end.value<=start.value)end.value='';document.querySelector('#booking-result').hidden=true;});
  end.addEventListener('change',()=>document.querySelector('#booking-result').hidden=true);
  document.querySelector('#pickup').addEventListener('change',()=>document.querySelector('#booking-result').hidden=true);
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-car]');if(!button)return;selectedCar=cars.find(car=>car.name===button.dataset.car);document.querySelector('#booking-title').textContent=selectedCar.name;document.querySelector('#booking-result').hidden=true;document.querySelector('#form-error').textContent='';dialog.showModal();});
  document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  document.querySelector('#booking-form').addEventListener('submit',event=>{event.preventDefault();const days=Math.round((Date.parse(end.value)-Date.parse(start.value))/86400000);if(start.value<dateString(new Date())||!Number.isFinite(days)||days<1){document.querySelector('#form-error').textContent='Choisissez une date de retour après la date de départ, avec un départ à partir d’aujourd’hui.';return;}document.querySelector('#form-error').textContent='';const amount=days*selectedCar.price;document.querySelector('#estimate').textContent=`Estimation indicative : ${amount.toLocaleString('fr-MA')} MAD pour ${days} jour${days>1?'s':''}. Hors options, dépôt de garantie et frais éventuels à confirmer.`;document.querySelector('#summary').value=`Demande de location — A12IHSSN LOCATION VOITURE\nModèle : ${selectedCar.name} ou similaire\nDépart : ${start.value}\nRetour : ${end.value}\nLieu : ${document.querySelector('#pickup').value}\nDurée : ${days} jour(s)\nEstimation indicative : ${amount} MAD\nSous réserve de disponibilité et de confirmation par l’agence.`;document.querySelector('#copy-summary').textContent='Copier ma demande';document.querySelector('#booking-result').hidden=false;});
  document.querySelector('#copy-summary').addEventListener('click',async()=>{const summary=document.querySelector('#summary');try{await navigator.clipboard.writeText(summary.value);document.querySelector('#copy-summary').textContent='Demande copiée ✓';}catch{summary.focus();summary.select();document.querySelector('#copy-summary').textContent='Sélectionné — appuyez sur Ctrl+C';}});
}
