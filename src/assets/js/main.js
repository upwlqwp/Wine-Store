'use strict'

///// INPUTMASK ///





const form  = document.querySelector('.invitation__form');
const telSelector = form.querySelector('input[type = "tel"]');
const inputmask = new Inputmask ('+7 (999) 999-99-99');
inputmask.mask(telSelector)






//// TABS /////

const tabItem = document.querySelectorAll('.tabs__button-item');
const tabContent = document.querySelectorAll('.tabs__content-item');


tabItem.forEach(function(element){
    element.addEventListener('click', open);
});

function open(evt){

    const tabTarget = evt.currentTarget;
    const button = tabTarget.dataset.button;

    tabItem.forEach(function(item){

        item.classList.remove('tabs__button-item--active');
    });

    tabContent.forEach(function(item){

        item.classList.remove('tabs__content-item--active');
    });

    tabTarget.classList.add('tabs__button-item--active');

    document.querySelector(`#${button}`).classList.add('tabs__content-item--active');
}