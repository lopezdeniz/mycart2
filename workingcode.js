let cartItems = [];
// Объявление пустого массива для хранения элементов корзины.

const updateCartIconCount = () => {
    const cartIcon = document.getElementById('cart-icon');
    // Получение элемента значка корзины по ID.

    const cartCountElement = cartIcon.querySelector('#cart-count');
    // Получение элемента, отображающего количество товаров в корзине.

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    // Вычисление общего количества товаров в корзине путем суммирования количества каждого товара.

    cartCountElement.textContent = cartItemCount;
    // Установка текстового содержимого элемента с количеством товаров.

    cartCountElement.style.display = cartItemCount > 0 ? 'inline-block' : 'none';
    // Изменение стиля отображения элемента в зависимости от количества товаров.
};

const renderCart = () => {
    const cartElement = document.getElementById('cart-items');
    // Получение элемента для отображения товаров корзины по ID.

    const totalPriceElement = document.getElementById('total-price');
    // Получение элемента для отображения общей стоимости по ID.

    cartElement.innerHTML = '';
    // Очистка содержимого элемента корзины.

    let totalPrice = 0;
    // Инициализация переменной для хранения общей стоимости.

    cartItems.forEach((item, index) => {
        const { name, price, quantity, size, toppings } = item;
        // Деструктуризация объекта item для получения имени, цены, количества, размера и топпингов.

        const itemTotal = price * quantity;
        // Вычисление общей стоимости данного товара.

        const itemElement = document.createElement('div');
        // Создание нового div элемента для товара.

        itemElement.classList.add('cart-item');
        // Добавление класса 'cart-item' к элементу товара.

        const itemNameElement = document.createElement('span');
        // Создание нового span элемента для имени товара.

        itemNameElement.textContent = `${name}${size ? `(${size})` : ''} - ${price}руб. x ${quantity}`;
        // Установка текстового содержимого span с именем, размером, ценой и количеством товара.

        itemNameElement.classList.add('cart-item-name');
        // Добавление класса 'cart-item-name' к элементу имени товара.

        itemElement.appendChild(itemNameElement);
        // Добавление элемента имени товара в элемент товара.

        if (toppings && toppings.length > 0) {
            const toppingsElement = document.createElement('div');
            // Создание нового div элемента для топпингов.

            toppingsElement.textContent = `Ингредиенты: ${toppings.join(', ')}`;
            // Установка текстового содержимого для топпингов.

            itemElement.appendChild(toppingsElement);
            // Добавление элемента топпингов в элемент товара.
        }

        const removeButton = document.createElement('button');
        // Создание нового элемента кнопки для удаления товара.

        removeButton.textContent = 'Удалить';
        // Установка текстового содержимого кнопки.

        removeButton.onclick = () => removeFromCart(index);
        // Установка обработчика события onclick для кнопки удаления.

        itemElement.appendChild(removeButton);
        // Добавление кнопки удаления в элемент товара.

        const decreaseButton = document.createElement('button');
        // Создание нового элемента кнопки для уменьшения количества товара.

        decreaseButton.textContent = '-';
        // Установка текстового содержимого кнопки.

        decreaseButton.onclick = () => decreaseQuantity(index);
        // Установка обработчика события onclick для кнопки уменьшения количества.

        itemElement.appendChild(decreaseButton);
        // Добавление кнопки уменьшения количества в элемент товара.

        const increaseButton = document.createElement('button');
        // Создание нового элемента кнопки для увеличения количества товара.

        increaseButton.textContent = '+';
        // Установка текстового содержимого кнопки.

        increaseButton.onclick = () => increaseQuantity(index);
        // Установка обработчика события onclick для кнопки увеличения количества.

        itemElement.appendChild(increaseButton);
        // Добавление кнопки увеличения количества в элемент товара.

        cartElement.appendChild(itemElement);
        // Добавление элемента товара в элемент корзины.

        totalPrice += itemTotal;
        // Увеличение общей стоимости на стоимость данного товара.
    });

    totalPriceElement.textContent = `Общая стоимость: ${totalPrice}руб.`;
    // Установка текстового содержимого элемента общей стоимости.

    if (!document.querySelector('.deliveryMessage')) {
        totalPriceElement.insertAdjacentHTML('afterend', '<p class="deliveryMessage">Стоимость доставки вам сообщит Диспетчер</p>');
        // Добавление сообщения о стоимости доставки, если его еще нет.
    }

    updateCartIconCount();
    // Обновление количества товаров в значке корзины.
};

window.onload = () => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    // Получение сохраненных в localStorage элементов корзины и их преобразование в объект.

    if (savedCartItems) {
        cartItems = savedCartItems;
        // Если сохраненные элементы корзины существуют, присваивание их переменной cartItems.
    }

    renderCart();
    // Вызов функции renderCart для отображения корзины.
};

const addToCart = (name, price, button) => {
    const card = button.closest('.product');
    // Поиск ближайшего родительского элемента с классом 'product'.

    const quantity = parseInt(card.querySelector('.quantity').textContent);
    // Получение количества товара из элемента с классом 'quantity' и преобразование его в целое число.

    const existingItem = cartItems.find(item => item.name === name && !item.size && (!item.toppings || item.toppings.length === 0));
    // Поиск существующего товара в корзине без размера и топпингов с тем же именем.

    if (existingItem) {
        existingItem.quantity += quantity;
        // Если такой товар существует, увеличение его количества.
    } else {
        cartItems.push({ name, price, quantity });
        // Если товара нет, добавление нового товара в корзину.
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Сохранение обновленной корзины в localStorage.

    updateCartIconCount();
    // Обновление количества товаров в значке корзины.

    renderCart();
    // Перерисовка корзины.
};

const addToCartPizza = (name, price, button) => {
    const card = button.closest('.product');
    // Поиск ближайшего родительского элемента с классом 'product'.

    const quantity = parseInt(card.querySelector('.quantity').textContent);
    // Получение количества товара из элемента с классом 'quantity' и преобразование его в целое число.

    const selectedSizeButton = card.querySelector('.size-btn.selected');
    // Поиск выбранного элемента размера пиццы.

    const selectedSize = selectedSizeButton.dataset.size;
    // Получение выбранного размера пиццы из атрибута data-size.

    const selectedSizePrice = parseInt(selectedSizeButton.dataset.price);
    // Получение цены выбранного размера пиццы из атрибута data-price и преобразование его в целое число.

    const selectedToppings = Array.from(card.querySelectorAll('input[type="checkbox"]:checked')).map(topping => topping.value);
    // Получение выбранных топпингов (галочки) и их преобразование в массив значений.

    const extraPrice = selectedToppings.reduce((total, topping) => total + parseInt(card.querySelector(`input[value="${topping}"]`).dataset.price), 0);
    // Вычисление дополнительной стоимости топпингов.

    const totalPrice = selectedSizePrice + extraPrice;
    // Вычисление общей стоимости пиццы с выбранным размером и топпингами.

    const newItem = { name, price: totalPrice, quantity, size: selectedSize, toppings: selectedToppings };
    // Создание нового объекта товара с указанными параметрами.

    const existingItem = cartItems.find(item => item.name === name && item.size === selectedSize && JSON.stringify(item.toppings) === JSON.stringify(selectedToppings));
    // Поиск существующего товара в корзине с тем же именем, размером и топпингами.

    if (existingItem) {
        existingItem.quantity += quantity;
        // Если такой товар существует, увеличение его количества.
    } else {
        cartItems.push(newItem);
        // Если товара нет, добавление нового товара в корзину.
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Сохранение обновленной корзины в localStorage.

    updateCartIconCount();
    // Обновление количества товаров в значке корзины.

    renderCart();
    // Перерисовка корзины.
};

const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    // Удаление товара из массива корзины по указанному индексу.

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Сохранение обновленной корзины в localStorage.

    renderCart();
    // Перерисовка корзины.

    updateCartIconCount();
    // Обновление количества товаров в значке корзины.
};


const decreaseQuantity = (index) => {
    if (cartItems[index].quantity > 1) {
        // Если количество товара больше 1, уменьшаем его на 1.
        cartItems[index].quantity--;
        // Сохраняем обновленное состояние корзины в localStorage.
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        // Перерисовываем корзину.
        renderCart();
        // Обновляем количество товаров в значке корзины.
        updateCartIconCount();
    }
};

const increaseQuantity = (index) => {
    // Увеличиваем количество товара на 1.
    cartItems[index].quantity++;
    // Сохраняем обновленное состояние корзины в localStorage.
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Перерисовываем корзину.
    renderCart();
    // Обновляем количество товаров в значке корзины.
    updateCartIconCount();
};

















// Уменьшает количество товара на карточке
const decreaseQuantityCard = (button) => {
    const card = button.closest('.product'); // Находим карточку товара
    const quantityElement = button.nextElementSibling; // Находим элемент количества
    let quantity = parseInt(quantityElement.textContent); // Получаем текущее количество
    if (quantity > 1) { // Проверяем, больше ли 1
        quantity--; // Уменьшаем количество
        quantityElement.textContent = quantity; // Обновляем отображаемое количество
        updateTotalPrice(card); // Обновляем общую цену
    }
};

// Увеличивает количество товара на карточке
const increaseQuantityCard = (button) => {
    const card = button.closest('.product'); // Находим карточку товара
    const quantityElement = button.previousElementSibling; // Находим элемент количества
    let quantity = parseInt(quantityElement.textContent); // Получаем текущее количество
    quantity++; // Увеличиваем количество
    quantityElement.textContent = quantity; // Обновляем отображаемое количество
    updateTotalPrice(card); // Обновляем общую цену
};

// Выбирает размер товара на карточке
const selectSize = (button) => {
    const card = button.closest('.product'); // Находим карточку товара
    card.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected')); // Убираем выделение у всех кнопок размера
    button.classList.add('selected'); // Выделяем выбранный размер
    updateTotalPrice(card); // Обновляем общую цену
};

// Переключает меню добавок товара
const toggleToppingsMenu = (button) => {
    const toppingsMenu = button.nextElementSibling; // Находим меню добавок
    toppingsMenu.style.display = toppingsMenu.style.display === 'none' ? 'block' : 'none'; // Переключаем отображение меню
    const checkboxes = toppingsMenu.querySelectorAll('input[type="checkbox"]'); // Находим все чекбоксы
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => updateTotalPrice(button.closest('.product')))); // Добавляем обработчик изменения для каждого чекбокса
};

// Обновляет общую цену товара
const updateTotalPrice = (card) => {
    const quantity = parseInt(card.querySelector('.quantity').textContent); // Получаем количество товара
    const selectedSizeButton = card.querySelector('.size-btn.selected'); // Получаем выбранную кнопку размера
    const selectedSizePrice = parseInt(selectedSizeButton.dataset.price); // Получаем цену выбранного размера
    const selectedToppings = Array.from(card.querySelectorAll('input[type="checkbox"]:checked')).map(topping => parseInt(topping.dataset.price)); // Получаем цены выбранных добавок
    const extraPrice = selectedToppings.reduce((total, price) => total + price, 0); // Считаем дополнительную стоимость добавок
    const totalPrice = (selectedSizePrice + extraPrice) * quantity; // Считаем общую стоимость товара
    card.querySelector('.total-price').textContent = `Стоимость: ${totalPrice}₽`; // Обновляем отображаемую общую стоимость
};

// Уменьшает количество товара на карточке (альтернативная версия)
const decreaseQuantityCardItem = (button) => {
    const card = button.closest('.product'); // Находим карточку товара
    const quantityElement = button.nextElementSibling; // Находим элемент количества
    let quantity = parseInt(quantityElement.textContent); // Получаем текущее количество
    if (quantity > 1) { // Проверяем, больше ли 1
        quantity--; // Уменьшаем количество
        quantityElement.textContent = quantity; // Обновляем отображаемое количество
        updateTotalPriceItem(card); // Обновляем цену товара
    }
};

// Увеличивает количество товара на карточке (альтернативная версия)
const increaseQuantityCardItem = (button) => {
    const card = button.closest('.product'); // Находим карточку товара
    const quantityElement = button.previousElementSibling; // Находим элемент количества
    let quantity = parseInt(quantityElement.textContent); // Получаем текущее количество
    quantity++; // Увеличиваем количество
    quantityElement.textContent = quantity; // Обновляем отображаемое количество
    updateTotalPriceItem(card); // Обновляем цену товара
};

// Обновляет цену товара
const updateTotalPriceItem = (card) => {
    const quantity = parseInt(card.querySelector('.quantity').textContent); // Получаем количество товара
    const basePrice = parseInt(card.dataset.price); // Получаем базовую цену
    const totalPrice = basePrice * quantity; // Считаем общую цену
    card.querySelector('.myprice').textContent = `Цена: $${totalPrice}`; // Обновляем отображаемую цену
};


















// Функция для перехода на главную страницу
const goToMainPage = () => {
    // Проверяет, находимся ли мы не на главной странице
    if (window.location.href !== 'index.html') {
        // Если не на главной странице, то переходим на главную
        window.location.href = 'index.html';
    }
};

// Функция для проверки валидности имени
function isValidName(name) {
    // Регулярное выражение для проверки допустимых символов (буквы и пробелы)
    const namePattern = /^[a-zA-Zа-яА-Я ]+$/;
    // Возвращает true, если имя соответствует шаблону
    return namePattern.test(name);
}

// Функция для проверки валидности телефона
function isValidPhone(phone) {
    // Регулярное выражение для проверки допустимых символов (цифры, опциональный плюс)
    const phonePattern = /^\+?\d{10,15}$/;
    // Возвращает true, если телефон соответствует шаблону
    return phonePattern.test(phone);
}

// Функция для проверки, что значение не пустое
function isNotEmpty(value) {
    // Возвращает true, если значение не пустое и не состоит только из пробелов
    return value && value.trim() !== '';
}

// Основная функция оформления заказа
const checkout = () => {
    // Получаем элементы формы
    const checkoutButton = document.getElementById('checkout-button');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const commentInput = document.getElementById('comment'); // Новый элемент для комментария

    // Получаем значения из элементов формы
    const name = nameInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;
    const comment = commentInput.value; // Получаем значение комментария

    // Сбрасываем плейсхолдеры
    nameInput.placeholder = '';
    phoneInput.placeholder = '';
    addressInput.placeholder = '';

    // Проверка имени
    if (!isNotEmpty(name) || !isValidName(name)) {
        // Если имя невалидное, показываем ошибку
        nameInput.placeholder = 'ВВЕДИТЕ ИМЯ';
        nameInput.classList.add('error-placeholder');
        nameInput.style.borderColor = 'red';
        return;
    } else {
        // Если имя валидное, убираем ошибку
        nameInput.classList.remove('error-placeholder');
        nameInput.style.borderColor = '';
    }

    // Проверка телефона
    if (!isNotEmpty(phone) || !isValidPhone(phone)) {
        // Если телефон невалидный, показываем ошибку
        phoneInput.placeholder = 'ВВЕДИТЕ ТЕЛЕФОН !';
        phoneInput.classList.add('error-placeholder');
        phoneInput.style.borderColor = 'red';
        return;
    } else {
        // Если телефон валидный, убираем ошибку
        phoneInput.classList.remove('error-placeholder');
        phoneInput.style.borderColor = '';
    }

    // Проверка адреса
    if (!isNotEmpty(address)) {
        // Если адрес невалидный, показываем ошибку
        addressInput.placeholder = 'ВВЕДИТЕ АДРЕС !';
        addressInput.classList.add('error-placeholder');
        addressInput.style.borderColor = 'red';
        return;
    } else {
        // Если адрес валидный, убираем ошибку
        addressInput.classList.remove('error-placeholder');
        addressInput.style.borderColor = '';
    }

    // Меняем текст и стиль кнопки оформления
    checkoutButton.textContent = 'ОТПРАВКА';
    checkoutButton.style.backgroundColor = 'red';
    checkoutButton.style.width = '150px';
    checkoutButton.style.margin = '0 auto';
    checkoutButton.style.display = 'block';
    checkoutButton.style.fontSize = "20px";
    checkoutButton.style.fontWeight = "bold";
    checkoutButton.style.borderRadius = "25px";

    // Отправляем заказ в Telegram, включая комментарий
    sendOrderToTelegram(name, phone, address, comment);

    // Через 1 секунду меняем текст и стиль кнопки оформления обратно и очищаем поля
    setTimeout(() => {
        checkoutButton.textContent = 'Готово! Сейчас мы вам перезвоним для сверки заказа.';
        checkoutButton.style.backgroundColor = '';
        checkoutButton.style.width = '';
        checkoutButton.style.margin = '';
        checkoutButton.style.display = '';
        checkoutButton.style.fontSize = "";
        checkoutButton.style.fontWeight = "";

        // Очищаем поля ввода
        nameInput.value = '';
        phoneInput.value = '';
        addressInput.value = '';
        commentInput.value = ''; // Очищаем комментарий
    }, 1000);

    // Очищаем корзину и обновляем отображение
    cartItems = [];
    localStorage.removeItem('cartItems');
    renderCart();

    // Показ кнопки "назад к покупкам" и добавление обработчика события
    const backButton = document.getElementById('back-to-shopping');
    backButton.style.display = 'block';
    backButton.addEventListener('click', goToMainPage);
};

// Функция для отправки заказа в Telegram
const sendOrderToTelegram = (name, phone, address, comment) => { // Добавлен комментарий
    // Генерируем номер заказа
    const orderNumber = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    // Формируем сообщение с данными заказа, включая комментарий
    let message = `Новый заказ!\n\nНомер заказа: ${orderNumber}\nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\nКомментарий: ${comment}\n\n`; // Добавлен комментарий

    // Вычисляем общую стоимость заказа
    let totalPrice = calculateTotalPrice();

    // Добавляем информацию о каждом товаре в корзине к сообщению
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

    // Добавляем общую стоимость к сообщению
    message += `\nОбщая стоимость: ${totalPrice} руб.`;

    // Отправляем запрос к API Telegram
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.telegram.org/bot5790561769:AAFXHNyxsGSq2z7I0ds6HhSKaNisZ416m8U/sendMessage', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        chat_id: '-1002094926558',
        text: message
    }));
};

// Функция для вычисления общей стоимости корзины
const calculateTotalPrice = () => {
    // Суммируем стоимость всех товаров в корзине
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Функция для открытия страницы корзины
const openCart = () => {
    window.location.href = 'cart.html';
};

// Добавление обработчика события для загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Добавление обработчиков событий для модального окна
document.addEventListener('DOMContentLoaded', () => {
    let callBackButton = document.getElementById('callback-button');
    let modal1 = document.getElementById('modal-1');
    let closeButton = modal1.getElementsByClassName('modal__close-button')[0];
    let tagBody = document.getElementsByTagName('body');

    // Открытие модального окна при нажатии на кнопку
    callBackButton.onclick = function (e) {
        e.preventDefault();
        modal1.classList.add('modal_active');
        tagBody.classList.add('hidden');
    };

    // Закрытие модального окна при нажатии на кнопку закрытия
    closeButton.onclick = function (e) {
        e.preventDefault();
        modal1.classList.remove('modal_active');
        tagBody.classList.remove('hidden');
    };

    // Закрытие модального окна при нажатии вне его содержимого
    modal1.onmousedown = function (e) {
        let target = e.target;
        let modalContent = modal1.getElementsByClassName('modal__content')[0];
        if (e.target.closest('.' + modalContent.className) === null) {
            this.classList.remove('modal_active');
            tagBody.classList.remove('hidden');
        }
    };

    // Открытие модального окна для всех кнопок с классом "get-modal_1"
    let buttonOpenModal1 = document.getElementsByClassName('get-modal_1');
    for (let button of buttonOpenModal1) {
        button.onclick = function (e) {
            e.preventDefault();
            modal1.classList.add('modal_active');
            tagBody.classList.add('hidden');
        };
    }
});








const toggleOverlay = (container) => {
    // Переключаем видимость оверлея, изменяя его прозрачность.
    const overlay = container.querySelector('.overlay');
    const currentOpacity = window.getComputedStyle(overlay).opacity;
    overlay.style.opacity = currentOpacity == 0 ? '1' : '0';
};






document.addEventListener('DOMContentLoaded', function () {
    // Добавляем анимацию к кнопкам добавления в корзину.
    const btnsAddToCart = document.querySelectorAll('.btnadd:not([data-animation="disabled"])');
    const cartIcon = document.getElementById('cart-icon');

    // Для каждой кнопки добавления в корзину...
    btnsAddToCart.forEach(btn => {
        btn.addEventListener('click', function (event) {
            // Получаем элемент продукта и его изображение.
            const product = event.target.closest('.product');
            const productName = product.querySelector('h2').innerText;
            const productImage = product.querySelector('img');

            // Клонируем изображение продукта.
            const imageClone = productImage.cloneNode(true);
            const imageRect = productImage.getBoundingClientRect();
            const x = imageRect.left + imageRect.width / 2;
            const y = imageRect.top + imageRect.height / 2;
            const xEnd = cartIcon.getBoundingClientRect().left;
            const yEnd = cartIcon.getBoundingClientRect().top;

            // Устанавливаем стили для анимации клонированного изображения.
            imageClone.style.position = 'fixed';
            imageClone.style.left = x + 'px';
            imageClone.style.top = y + 'px';
            imageClone.style.width = (imageRect.width * 0.2) + 'px';
            imageClone.style.height = (imageRect.height * 0.2) + 'px';
            imageClone.style.borderRadius = '50%';
            imageClone.style.transition = 'transform 0.5s ease-out';

            // Добавляем клонированное изображение в документ для анимации.
            document.body.appendChild(imageClone);

            // Начинаем анимацию перемещения изображения к значку корзины.
            setTimeout(() => {
                imageClone.style.transform = `translate(${xEnd - x}px, ${yEnd - y}px)`;
            }, 100);

            // Уменьшаем прозрачность и сбрасываем трансформацию через 600 мс.
            setTimeout(() => {
                imageClone.style.opacity = '0';
                imageClone.style.transform = `translate(0, 0)`;
            }, 600);

            // Удаляем клонированное изображение из документа через 1100 мс.
            setTimeout(() => {
                imageClone.remove();
            }, 1100);
        });
    });
});