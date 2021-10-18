
import {getResource} from '../services/services';
function cards() {
    //создание классов для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) { //+Rest 0
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes; //rest 1
            this.parent = document.querySelector(parentSelector);
            this.transfer = 77;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;

        }

        render() {
            const el = document.createElement('div');
            if (this.classes.length === 0) {                      //добавление класса по умолчанию в случае его отсутствия
                this.el = 'menu__item';
                el.classList.add(this.el);
            } else {
                this.classes.forEach(className => el.classList.add(className)); //Rest 2
            }

            el.innerHTML = ` 
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
                `;
            this.parent.append(el);
        }
    }


    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });

        });
//или через fetch
    /*fetch('http://localhost:3000/menu')// start json-server // npx json-server --watch db.json

        .then(data => data.json())
        .then(res => console.log(res));*/
}
export default cards;