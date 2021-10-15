window.addEventListener('DOMContentLoaded', function () {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer
    const deadLine = '2021-12-10';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60) % 24));

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds

        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }

        }


    }

    setClock('.timer', deadLine);

    // Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }



    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close')=='') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        10,
        '.menu .container',
        /*'menu__item', //rest 3
        'big'*/
    ).render(); //одноразовый вызов объекта

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        9,
        '.menu .container'
        /* 'menu__item'*/
    ).render(); //одноразовый вызов объекта

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        12,
        '.menu .container'
        /*'menu__item'*/
    ).render(); //одноразовый вызов объекта

    //Forms отправка данных на сервер

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, мы с вами свяжемся',
        failure: 'Что-то пошло не так'

    }

    forms.forEach(i => {
        postData(i);
    })

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src=message.loading;
            statusMessage.style.cssText=`
            display: block;
            margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);
//переписано под использование Fetch API

            /*const req = new XMLHttpRequest();
            req.open('POST', 'server.php');*/

            /*req.setRequestHeader('Content-type', 'application/json');*/ //убрал из-за использования fetch
            /*req.setRequestHeader('Content-type', 'multipart/form-data');*/ //писать не надо т.к. устанавливается автоматически при отправке через form-data
            const formData = new FormData(form);

            const obj = {}
            formData.forEach(function (value, key) { // переборка объекта formData, для помещения его в новый простой объект и последующей обработки json
                obj[key] = value;
            })

            /*const json = JSON.stringify(obj);*/ //не используется с fetch
            fetch('server.php',{
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body : JSON.stringify(obj)

            })
                .then(data => data.text())
                .then(data=>{
                console.log(data);
                showThanksModal(message.success);


                statusMessage.remove();

            })
                .catch(()=>{
                showThanksModal(message.failure);

            }).finally(()=>{
                form.reset();

            })
            /*req.send(json);*/ // убрано для использования fetch
            /*req.send(formData);*/

            /*req.addEventListener('load', () => {          //обработка результата запроса
                if (req.status === 200) {
                    console.log(req.response);
                    showThanksModal(message.success);
                    form.reset();

                        statusMessage.remove();

                } else {
                    showThanksModal(message.failure);
                }
            })*/
        });
    }

          //смена модального окна при отправке формы, добавление спиннера
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();
        const  thanksModal=document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        },4000);
    }
    fetch('http://localhost:3000/menu')// start json-server // npx json-server --watch db.json

        .then(data=>data.json())
        .then(res => console.log(res));
});
