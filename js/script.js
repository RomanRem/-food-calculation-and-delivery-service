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
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
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

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });

        });
    //axios
    /*axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });*/
    // вариант без шаблонизации - если надо создать элементы один раз
    /*getResource('http://localhost:3000/menu')
        .then(data => createCard(data));
        function createCard(data){
            data.forEach(({img, altimg, title, descr, price}) =>{
                const element = document.createElement('div');

                element.classList.add('menu__item');

                element.innerHTML =`
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> руб/день</div>
                </div>
                `;
                document.querySelector('.menu .container').append(element);
            });
        }*/

    //Forms отправка данных на сервер

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, мы с вами свяжемся',
        failure: 'Что-то пошло не так'

    }

    forms.forEach(i => {
        bindPostData(i);
    })
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    async function getResource(url) {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);
//переписано под использование Fetch API

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries())); //элегантный способ
            /*const obj = {};
//не элегантный formData.forEach(function (value, key) { // переборка объекта formData, для помещения его в новый простой объект и последующей обработки json
                obj[key] = value;
            });*/

            postData('http://localhost:3000/requests', json)

                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);

                    statusMessage.remove();

                })
                .catch(() => {
                    showThanksModal(message.failure);

                }).finally(() => {
                form.reset();

            })

        });
    }

    //смена модального окна при отправке формы, добавление спиннера
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')// start json-server // npx json-server --watch db.json

        .then(data => data.json())
        .then(res => console.log(res));

    // создание простого слайдера
    let offset = 0;
    let slideIndex = 1;
    // добавление карусельки
    // добавление навигационного слайдера
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector('.offer__slider-inner');

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });
    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
    dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `; // Если хотите - добавьте в стили, но иногда у нас нет доступа к стилям
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

     function slideLength () {
        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
     };
     function dotsA (){
        dots.forEach(dot => dot.style.opacity = ".5");
        dots[slideIndex-1].style.opacity = 1;

     };
     function slidesTransform() {
         slidesField.style.transform = `translateX(-${offset}px)`;
     };
    next.addEventListener('click', () => {
        if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        slidesTransform()


        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        slideLength()

        dotsA()

    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesTransform()

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        slideLength()

        dotsA()
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesTransform()

            slideLength()
            dotsA()
        });

    })
    /*showSlides(slideIndex);                                       //блок обычного слайдера
        if(slides.length<10){
            total.textContent=`0${slides.length}`;

        }else {
            total.textContent= slides.length;
        };

    function showSlides(n) {
        if (n>slides.length){
            slideIndex = 1;
        }
        if (n<1){
            slideIndex=slides.length;
        }
        slides.forEach(item=> item.style.display = 'none');
        slides[slideIndex-1].style.display = 'block';

        if(slides.length<10){
            current.textContent=`0${slideIndex}`;

        }else {
            total.textContent= slideIndex;
        };
    }
    function plusSlides(n) {
        showSlides(slideIndex+=n);
    }
    prev.addEventListener('click', ()=>{
        plusSlides(-1);

    });
    next.addEventListener('click', ()=>{
        plusSlides(1);

    });*/
});
