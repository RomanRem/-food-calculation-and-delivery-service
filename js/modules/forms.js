'use strict';
import {openModal, clodeModal} from './modal';

function forms (){
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

export default forms;