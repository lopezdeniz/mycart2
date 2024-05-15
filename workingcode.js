
const checkout = () => { // Определение функции checkout
    const checkoutButton = document.getElementById('checkout-button'); // Получение кнопки оформления заказа
    const nameInput = document.getElementById('name'); // Получение поля ввода имени
    const phoneInput = document.getElementById('phone'); // Получение поля ввода телефона
    const addressInput = document.getElementById('address'); // Получение поля ввода адреса

    const name = nameInput.value; // Получение значения имени из поля ввода
    const phone = phoneInput.value; // Получение значения телефона из поля ввода
    const address = addressInput.value; // Получение значения адреса из поля ввода

    // Устанавливаем пустые сообщения об ошибках перед проверкой
    nameInput.placeholder = ''; // Удаление текста placeholder для имени
    phoneInput.placeholder = ''; // Удаление текста placeholder для телефона
    addressInput.placeholder = ''; // Удаление текста placeholder для адреса

    // Проверяем поля на пустоту и корректность данных
    if (!isNotEmpty(name) || !isValidName(name)) { // Если имя пустое или некорректное
        nameInput.placeholder = 'ВВЕДИТЕ ИМЯ'; // Установка текста placeholder для имени
        nameInput.classList.add('error-placeholder'); // Добавление класса для стилизации ошибочного поля
        nameInput.style.borderColor = 'red'; // Установка красной рамки для ошибочного поля
        return; // Прекращаем выполнение функции
    } else { // Иначе
        nameInput.classList.remove('error-placeholder'); // Удаляем класс ошибки, если он был добавлен ранее
        nameInput.style.borderColor = ''; // Удаляем красную рамку, если ошибка была исправлена
    }

    if (!isNotEmpty(phone) || !isValidPhone(phone)) { // Если телефон пустой или некорректный
        phoneInput.placeholder = 'ВВЕДИТЕ ТЕЛЕФОН !'; // Установка текста placeholder для телефона
        phoneInput.classList.add('error-placeholder'); // Добавление класса для стилизации ошибочного поля
        phoneInput.style.borderColor = 'red'; // Установка красной рамки для ошибочного поля
        return; // Прекращаем выполнение функции
    } else { // Иначе
        phoneInput.classList.remove('error-placeholder'); // Удаляем класс ошибки, если он был добавлен ранее
        phoneInput.style.borderColor = ''; // Удаляем красную рамку, если ошибка была исправлена
    }

    if (!isNotEmpty(address)) { // Если адрес пустой
        addressInput.placeholder = 'ВВЕДИТЕ АДРЕС !'; // Установка текста placeholder для адреса
        addressInput.classList.add('error-placeholder'); // Добавление класса для стилизации ошибочного поля
        addressInput.style.borderColor = 'red'; // Установка красной рамки для ошибочного поля
        return; // Прекращаем выполнение функции
    } else { // Иначе
        addressInput.classList.remove('error-placeholder'); // Удаляем класс ошибки, если он был добавлен ранее
        addressInput.style.borderColor = ''; // Удаляем красную рамку, если ошибка была исправлена
    }
    // Меняем текст и стиль кнопки
    checkoutButton.textContent = 'ОТПРАВКА';
    checkoutButton.style.backgroundColor = 'red';
    checkoutButton.style.width = '150px';
    checkoutButton.style.margin = '0 auto';
    checkoutButton.style.display = 'block';
    checkoutButton.style.fontSize = "20px";
    checkoutButton.style.fontWeight = "bold";

    // Отправляем заказ в телеграм
    sendOrderToTelegram(name, phone, address);

    setTimeout(() => {
        checkoutButton.textContent = 'Готово! Сейчас мы вам перезвоним для сверки заказа.';
        checkoutButton.style.backgroundColor = '';
        checkoutButton.style.width = '';
        // Очищаем поля ввода
        nameInput.value = '';
        phoneInput.value = '';
        addressInput.value = '';
    }, 1000);

    // Очищаем корзину и удаляем данные из локального хранилища
    cartItems = [];
    localStorage.removeItem('cartItems');
    renderCart();

    // Показываем кнопку "Вернуться к покупкам" и назначаем ей обработчик события для перехода на главную страницу
    const backButton = document.getElementById('back-to-shopping');
    backButton.style.display = 'block';
    backButton.addEventListener('click', goToMainPage);
};





// Обновленная функция отправки заказов, которая теперь принимает параметры
const sendOrderToTelegram = (name, phone, address) => {
    // Создаем сообщение с данными о заказе и информацией о клиенте
    let message = `Новый заказ!\n\nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\n\n`;
    let totalPrice = calculateTotalPrice();

    cartItems.forEach(({ name, price, quantity }) => {
        const itemTotal = price * quantity;
        message += `${name} - ${price} руб. x ${quantity} = ${itemTotal} руб.\n`;
    });

    message += `\nОбщая стоимость: ${totalPrice} руб.`;

    // Отправляем сообщение в телеграм
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.telegram.org/bot5790561769:AAFXHNyxsGSq2z7I0ds6HhSKaNisZ416m8U/sendMessage', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ chat_id: '-1002094926558', text: message }));
};











//11111111111111

// Функция для вычисления общей стоимости заказа
const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Функция для открытия корзины
const openCart = () => {
    window.location.href = 'cart.html'; // Перенаправляет пользователя на страницу корзины (cart.html)
};

// Функция для обновления счетчика товара
const updateCartCount = () => {
    // ваша функция для обновления счетчика товара
};

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});




///Проверка модального окна 


document.addEventListener('DOMContentLoaded', () => {

    // Кнопка по которой происходит клик
    let callBackButton = document.getElementById('callback-button');

    // Модальное окно, которое необходимо открыть
    let modal1 = document.getElementById('modal-1');

    // Кнопка "закрыть" внутри модального окна
    let closeButton = modal1.getElementsByClassName('modal__close-button')[0];

    // Тег body для запрета прокрутки
    let tagBody = document.getElementsByTagName('body');

    callBackButton.onclick = function (e) {
        e.preventDefault();
        modal1.classList.add('modal_active');
        tagBody.classList.add('hidden');
    }

    closeButton.onclick = function (e) {
        e.preventDefault();
        modal1.classList.remove('modal_active');
        tagBody.classList.remove('hidden');
    }

    modal1.onmousedown = function (e) {
        let target = e.target;
        let modalContent = modal1.getElementsByClassName('modal__content')[0];
        if (e.target.closest('.' + modalContent.className) === null) {
            this.classList.remove('modal_active');
            tagBody.classList.remove('hidden');
        }
    };

    // Вызов модального окна несколькими кнопками на странице
    let buttonOpenModal1 = document.getElementsByClassName('get-modal_1');

    for (let button of buttonOpenModal1) {
        button.onclick = function (e) {
            e.preventDefault();
            modal1.classList.add('modal_active');
            tagBody.classList.add('hidden');
        }
    }

});





