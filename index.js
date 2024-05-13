let cartItems = [];

// Функция для обновления количества товаров в корзине и отображения на иконке
const updateCartIconCount = () => {
    // Получаем элемент иконки корзины
    const cartIcon = document.getElementById('cart-icon');
    // Находим элемент, отображающий количество товаров в корзине внутри иконки
    const cartCountElement = cartIcon.querySelector('#cart-count');
    // Вычисляем общее количество товаров в корзине путем суммирования количества каждого товара в массиве cartItems
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    // Устанавливаем текстовое содержимое элемента cartCountElement равным общему количеству товаров в корзине
    cartCountElement.textContent = cartItemCount;
    // Устанавливаем стиль отображения элемента cartCountElement в зависимости от того, есть ли товары в корзине
    cartCountElement.style.display = cartItemCount > 0 ? 'inline-block' : 'none';
};


// Функция для отображения содержимого корзины
const renderCart = () => {
    // Получаем элемент, в который будем отображать товары в корзине
    const cartElement = document.getElementById('cart-items');
    // Получаем элемент, в который будем отображать общую стоимость товаров
    const totalPriceElement = document.getElementById('total-price');
    // Очищаем содержимое элемента cartElement перед началом отображения новых товаров
    cartElement.innerHTML = '';
    // Инициализируем переменную для хранения общей стоимости товаров в корзине
    let totalPrice = 0;

    // Проходимся по каждому товару в корзине
    cartItems.forEach((item, index) => {
        // Деструктурируем объект товара, чтобы получить его свойства
        const { name, price, quantity } = item;
        // Вычисляем общую стоимость данного товара (цена * количество)
        const itemTotal = price * quantity;
        // Создаем новый элемент для отображения товара в корзине
        const itemElement = document.createElement('div');
        // Добавляем класс 'cart-item' к элементу товара
        itemElement.classList.add('cart-item');


        // Создаем элемент для названия товара
        const itemNameElement = document.createElement('span');
        itemNameElement.textContent = `${name} - ${price} руб. x ${quantity}`;
        itemNameElement.classList.add('cart-item-name'); // Добавляем класс для стилизации
        itemElement.appendChild(itemNameElement);

        // Создаем кнопки для управления количеством товара
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Удалить';
        removeButton.onclick = () => removeFromCart(index);
        removeButton.style.backgroundColor = 'black'; // Устанавливаем цвет фона кнопки черным
        removeButton.style.color = 'white'; // Устанавливаем цвет текста кнопки белым
        itemElement.appendChild(removeButton);
        removeButton.style.padding = '7px'; // Устанавливаем внутренний отступ в 7px

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.onclick = () => decreaseQuantity(index);
        decreaseButton.style.backgroundColor = 'black'; // Устанавливаем цвет фона кнопки черным
        decreaseButton.style.color = 'white'; // Устанавливаем цвет текста кнопки белым
        itemElement.appendChild(decreaseButton);
        decreaseButton.style.padding = '3px 7px'; // Устанавливаем внутренний отступ

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = () => increaseQuantity(index);
        increaseButton.style.backgroundColor = 'black'; // Устанавливаем цвет фона кнопки черным
        increaseButton.style.color = 'white'; // Устанавливаем цвет текста кнопки белым
        itemElement.appendChild(increaseButton);
        increaseButton.style.padding = '3px 7px'; // Устанавливаем внутренний отступ

        cartElement.appendChild(itemElement);
        totalPrice += itemTotal;

    });

    totalPriceElement.textContent = `Общая стоимость: ${totalPrice} руб.`;

    // Проверяем, существует ли уже элемент с текстом "Стоимость доставки вам сообщит Диспетчер"
    if (!document.querySelector('.deliveryMessage')) {
        // Если не существует, добавляем его
        totalPriceElement.insertAdjacentHTML('afterend', '<p class="deliveryMessage">Стоимость доставки вам сообщит Диспетчер</p>');
    }

    totalPriceElement.classList.add('total-price-text'); // Добавляем класс для стилизации общей стоимости
    updateCartIconCount(); // Вызываем функцию обновления счетчика товара
};





// При загрузке страницы проверяем наличие сохраненных данных в локальном хранилище
window.onload = () => {
    // Получаем данные из локального хранилища
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    // Если есть сохраненные данные, загружаем их в переменную cartItems
    if (savedCartItems) {
        cartItems = savedCartItems;
    }
    // Отображаем корзину
    renderCart();
};


//11111111111111111111





// Функция для добавления товара в корзину
const addToCart = (name, price, button) => {
    // Находим родительский элемент товара, к которому привязана кнопка добавления в корзину
    const card = button.closest('.product');
    // Получаем количество товара, указанное на карточке товара
    const quantity = parseInt(card.querySelector('.quantity').textContent);
    // Поиск товара в корзине по его имени
    const existingItem = cartItems.find(item => item.name === name);
    // Если товар уже существует в корзине, увеличиваем его количество
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Если товара нет в корзине, добавляем его в массив cartItems
        cartItems.push({ name, price, quantity });
    }
    // Сохраняем обновленный массив товаров в локальное хранилище
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Обновляем счетчик на иконке корзины
    updateCartIconCount();

    // Вызываем функцию для отображения содержимого корзины после обновления
    renderCart();
};






// Функция для удаления товара из корзины
const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    // Сохраняем данные в локальное хранилище
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();

    // Вызываем функцию для обновления счетчика на иконке корзины
    updateCartIconCount();
};







// Функция для уменьшения количества товара в корзине
const decreaseQuantity = (index) => {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
        updateCartIconCount();
    }
};

// Функция для увеличения количества товара в корзине
const increaseQuantity = (index) => {
    cartItems[index].quantity++;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
    updateCartIconCount();
};





// Функция для уменьшения количества товара на карточке
const decreaseQuantityCard = (button) => {
    const card = button.closest('.product');
    const quantityElement = card.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
    // Назначаем черный цвет фона кнопке
    button.style.backgroundColor = 'black';
};

// Функция для увеличения количества товара на карточке
const increaseQuantityCard = (button) => {
    const card = button.closest('.product');
    const quantityElement = card.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
    // Назначаем черный цвет фона кнопке
    button.style.backgroundColor = 'black';
};













// Функция для перехода на главную страницу
const goToMainPage = () => {
    // Проверяем, находимся ли мы уже на главной странице
    if (window.location.href !== 'index.html') {
        // Если нет, перенаправляем пользователя на главную страницу
        window.location.href = 'index.html';
    }
};






// Функция для проверки корректности введенного имени
function isValidName(name) {
    const namePattern = /^[a-zA-Zа-яА-Я ]+$/;
    return namePattern.test(name);
}

// Функция для проверки корректности введенного телефона
function isValidPhone(phone) {
    const phonePattern = /^\+?\d{10,15}$/;
    return phonePattern.test(phone);
}

// Функция для проверки на пустоту полей
function isNotEmpty(value) {
    return value && value.trim() !== '';
}

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

// Не забудьте заменить 'YOUR_BOT_TOKEN' и 'YOUR_CHAT_ID' на реальный токен вашего бота и ID чата.









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


// Модальное бургер


