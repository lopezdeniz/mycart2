let cartItems = [];

const updateCartIconCount = () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartCountElement = cartIcon.querySelector('#cart-count');
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartItemCount;
    cartCountElement.style.display = cartItemCount > 0 ? 'inline-block' : 'none';
};

const renderCart = () => {
    const cartElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartElement.innerHTML = '';
    let totalPrice = 0;
    cartItems.forEach((item, index) => {
        const { name, price, quantity, size, toppings } = item;
        const itemTotal = price * quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        const itemNameElement = document.createElement('span');
        itemNameElement.textContent = `${name}${size ? ` (${size})` : ''} - ${price} руб. x ${quantity}`;
        itemNameElement.classList.add('cart-item-name');
        itemElement.appendChild(itemNameElement);

        if (toppings && toppings.length > 0) {
            const toppingsElement = document.createElement('div');
            toppingsElement.textContent = `Ингредиенты: ${toppings.join(', ')}`;
            itemElement.appendChild(toppingsElement);
        }

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Удалить';
        removeButton.onclick = () => removeFromCart(index);
        itemElement.appendChild(removeButton);

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.onclick = () => decreaseQuantity(index);
        itemElement.appendChild(decreaseButton);

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = () => increaseQuantity(index);
        itemElement.appendChild(increaseButton);

        cartElement.appendChild(itemElement);
        totalPrice += itemTotal;
    });
    totalPriceElement.textContent = `Общая стоимость: ${totalPrice} руб.`;
    if (!document.querySelector('.deliveryMessage')) {
        totalPriceElement.insertAdjacentHTML('afterend', '<p class="deliveryMessage">Стоимость доставки вам сообщит Диспетчер</p>');
    }
    updateCartIconCount();
};

window.onload = () => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (savedCartItems) {
        cartItems = savedCartItems;
    }
    renderCart();
};

const addToCart = (name, price, button) => {
    const card = button.closest('.product');
    const quantity = parseInt(card.querySelector('.quantity').textContent);
    const existingItem = cartItems.find(item => item.name === name && !item.size && (!item.toppings || item.toppings.length === 0));
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ name, price, quantity });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartIconCount();
    renderCart();
};

const addToCartPizza = (name, price, button) => {
    const card = button.closest('.product');
    const quantity = parseInt(card.querySelector('.quantity').textContent);
    const selectedSizeButton = card.querySelector('.size-btn.selected');
    const selectedSize = selectedSizeButton.dataset.size;
    const selectedSizePrice = parseInt(selectedSizeButton.dataset.price);
    const selectedToppings = Array.from(card.querySelectorAll('input[type="checkbox"]:checked')).map(topping => topping.value);
    const extraPrice = selectedToppings.reduce((total, topping) => total + parseInt(card.querySelector(`input[value="${topping}"]`).dataset.price), 0);
    const totalPrice = selectedSizePrice + extraPrice;
    const newItem = { name, price: totalPrice, quantity, size: selectedSize, toppings: selectedToppings };
    const existingItem = cartItems.find(item => item.name === name && item.size === selectedSize && JSON.stringify(item.toppings) === JSON.stringify(selectedToppings));

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartIconCount();
    renderCart();
};

const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
    updateCartIconCount();
};

const decreaseQuantity = (index) => {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
        updateCartIconCount();
    }
};

const increaseQuantity = (index) => {
    cartItems[index].quantity++;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
    updateCartIconCount();
};

const toggleToppingsMenu = (button) => {
    const toppingsMenu = button.nextElementSibling;
    toppingsMenu.style.display = toppingsMenu.style.display === 'none' ? 'block' : 'none';
};

const selectSize = (button) => {
    const card = button.closest('.product');
    const price = button.dataset.price;

    // Устанавливаем новую цену
    card.querySelector('.myprice').textContent = `Цена: $${price}`;
    card.querySelector('.total-price').textContent = `Общая стоимость: $${price}`;

    // Убираем класс "selected" у всех кнопок размера
    card.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));

    // Добавляем класс "selected" к текущей кнопке
    button.classList.add('selected');
};


const decreaseQuantityCard = (button) => {
    const quantityElement = button.nextElementSibling;
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
};

const increaseQuantityCard = (button) => {
    const quantityElement = button.previousElementSibling;
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
};






// конец теста

















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

    cartItems.forEach(({ name, price, quantity, size, toppings }) => {
        const itemTotal = price * quantity;
        message += `${name} - ${price} руб. x ${quantity} = ${itemTotal} руб.`;
        if (size) {
            message += ` (${size})`;
        }
        if (toppings && toppings.length > 0) {
            message += `\nДополнительные ингредиенты: ${toppings.join(', ')}`;
        }
        message += '\n';
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





const toggleOverlay = (container) => {
    const overlay = container.querySelector('.overlay');
    const currentOpacity = window.getComputedStyle(overlay).opacity;
    overlay.style.opacity = currentOpacity == 0 ? '1' : '0';
};




// Полет в корзину

document.addEventListener('DOMContentLoaded', function () {
    const btnsAddToCart = document.querySelectorAll('.btnadd:not([data-animation="disabled"])');
    const cartIcon = document.getElementById('cart-icon');

    btnsAddToCart.forEach(btn => {
        btn.addEventListener('click', function (event) {
            const product = event.target.closest('.product');
            const productName = product.querySelector('h2').innerText;
            const productImage = product.querySelector('img');
            const imageClone = productImage.cloneNode(true);
            const imageRect = productImage.getBoundingClientRect();
            const x = imageRect.left + imageRect.width / 2;
            const y = imageRect.top + imageRect.height / 2;
            const xEnd = cartIcon.getBoundingClientRect().left;
            const yEnd = cartIcon.getBoundingClientRect().top;

            imageClone.style.position = 'fixed';
            imageClone.style.left = x + 'px';
            imageClone.style.top = y + 'px';
            imageClone.style.width = (imageRect.width * 0.2) + 'px'; // Уменьшаем на 30%
            imageClone.style.height = (imageRect.height * 0.2) + 'px'; // Уменьшаем на 30%
            imageClone.style.borderRadius = '50%';
            imageClone.style.transition = 'transform 0.5s ease-out';
            document.body.appendChild(imageClone);

            setTimeout(() => {
                imageClone.style.transform = `translate(${xEnd - x}px, ${yEnd - y}px)`;
            }, 100);

            setTimeout(() => {
                imageClone.style.opacity = '0';
                imageClone.style.transform = `translate(0, 0)`;
            }, 600);

            setTimeout(() => {
                imageClone.remove();
            }, 1100);
        });
    });
});





