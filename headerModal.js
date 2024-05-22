// Выполняется после полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем хедер и модальное окно
    loadHeaderAndModal();

    function loadHeaderAndModal() {
        // Выполняем запрос для получения HTML шаблона хедера и модального окна
        fetch('/headerModal.html')
            .then(response => response.text()) // Получаем текстовую версию ответа
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data); // Вставляем HTML в начало body
                initializeModal(); // Инициализируем модальное окно
                initializeAnimations(); // Инициализируем анимации
                renderCart(); // Инициализация корзины после загрузки шаблона
                bindAddToCartButtons(); // Привязываем кнопки добавления в корзину
            })
            .catch(error => console.error('Error loading header and modal:', error)); // Обработка ошибки загрузки
    }

    function initializeModal() {
        const callbackButton = document.getElementById('callback-button'); // Кнопка обратного звонка
        const modal = document.getElementById('modal-1'); // Модальное окно
        const closeButton = modal.querySelector('.modal__close-button'); // Кнопка закрытия модального окна
        const body = document.body;

        // Открытие модального окна при клике на кнопку обратного звонка
        callbackButton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('modal_active');
            body.classList.add('hidden'); // Скрываем скролл
        });

        // Закрытие модального окна при клике на кнопку закрытия
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('modal_active');
            body.classList.remove('hidden'); // Возвращаем скролл
        });

        // Закрытие модального окна при клике вне его содержимого
        modal.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.modal__content')) {
                modal.classList.remove('modal_active');
                body.classList.remove('hidden'); // Возвращаем скролл
            }
        });

        // Привязываем событие открытия модального окна для всех элементов с классом 'get-modal_1'
        let buttonOpenModal1 = document.getElementsByClassName('get-modal_1');
        for (let button of buttonOpenModal1) {
            button.onclick = function (e) {
                e.preventDefault();
                modal.classList.add('modal_active');
                body.classList.add('hidden'); // Скрываем скролл
            };
        }
    }

    function initializeAnimations() {
        // Находим все кнопки добавления в корзину, у которых анимация не отключена
        const btnsAddToCart = document.querySelectorAll('.btnadd:not([data-animation="disabled"])');
        const cartIcon = document.getElementById('cart-icon'); // Иконка корзины

        // Добавляем анимацию к кнопкам добавления в корзину
        btnsAddToCart.forEach(btn => {
            btn.addEventListener('click', function (event) {
                const product = event.target.closest('.product'); // Находим элемент продукта
                const productName = product.querySelector('h2').innerText; // Получаем название продукта
                const productImage = product.querySelector('img'); // Получаем изображение продукта
                const imageClone = productImage.cloneNode(true); // Клонируем изображение
                const imageRect = productImage.getBoundingClientRect(); // Получаем положение и размер изображения
                const x = imageRect.left + imageRect.width / 2; // Координата X центра изображения
                const y = imageRect.top + imageRect.height / 2; // Координата Y центра изображения
                const xEnd = cartIcon.getBoundingClientRect().left; // Координата X иконки корзины
                const yEnd = cartIcon.getBoundingClientRect().top; // Координата Y иконки корзины
                imageClone.style.position = 'fixed';
                imageClone.style.left = x + 'px';
                imageClone.style.top = y + 'px';
                imageClone.style.width = (imageRect.width * 0.2) + 'px'; // Уменьшаем размер клона
                imageClone.style.height = (imageRect.height * 0.2) + 'px'; // Уменьшаем размер клона
                imageClone.style.borderRadius = '50%';
                imageClone.style.transition = 'transform 0.5s ease-out'; // Плавная анимация перемещения
                document.body.appendChild(imageClone);
                setTimeout(() => {
                    imageClone.style.transform = `translate(${xEnd - x}px, ${yEnd - y}px)`; // Перемещение клона к иконке корзины
                }, 100);
                setTimeout(() => {
                    imageClone.style.opacity = '0';
                    imageClone.style.transform = `translate(0, 0)`; // Возврат клона в исходное положение перед удалением
                }, 600);
                setTimeout(() => {
                    imageClone.remove(); // Удаление клона после анимации
                }, 1100);
            });
        });
    }

    function bindAddToCartButtons() {
        // Находим все кнопки добавления в корзину
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

        // Привязываем обработчик события для каждой кнопки
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const product = event.target.closest('.product'); // Находим элемент продукта
                const productName = product.querySelector('.product-name').textContent; // Получаем название продукта
                const productPrice = parseFloat(product.querySelector('.product-price').textContent.replace('₽', '')); // Получаем цену продукта
                const quantity = parseInt(product.querySelector('.quantity').value, 10); // Получаем количество

                addToCart(productName, productPrice, quantity); // Добавляем товар в корзину
            });
        });
    }

    function renderCart() {
        const cartElement = document.getElementById('cart-items'); // Элемент для отображения товаров в корзине
        const totalPriceElement = document.getElementById('total-price'); // Элемент для отображения общей стоимости
        cartElement.innerHTML = ''; // Очищаем содержимое корзины
        let totalPrice = 0;
        cartItems.forEach((item, index) => {
            const { name, price, quantity, size, toppings } = item; // Деструктурируем объект товара
            const itemTotal = price * quantity; // Считаем общую стоимость товара
            const itemElement = document.createElement('div'); // Создаём элемент для товара
            itemElement.classList.add('cart-item');
            const itemNameElement = document.createElement('span'); // Элемент для названия товара
            itemNameElement.textContent = `${name}${size ? ` (${size})` : ''} - ${price} руб. x ${quantity}`; // Заполняем элемент
            itemNameElement.classList.add('cart-item-name');
            itemElement.appendChild(itemNameElement);
            if (toppings && toppings.length > 0) {
                const toppingsElement = document.createElement('div'); // Элемент для дополнительных ингредиентов
                toppingsElement.textContent = `Ингредиенты: ${toppings.join(', ')}`;
                itemElement.appendChild(toppingsElement);
            }
            const removeButton = document.createElement('button'); // Кнопка удаления товара
            removeButton.textContent = 'Удалить';
            removeButton.onclick = () => removeFromCart(index); // Привязываем событие удаления товара
            itemElement.appendChild(removeButton);
            const decreaseButton = document.createElement('button'); // Кнопка уменьшения количества
            decreaseButton.textContent = '-';
            decreaseButton.onclick = () => decreaseQuantity(index); // Привязываем событие уменьшения количества
            itemElement.appendChild(decreaseButton);
            const increaseButton = document.createElement('button'); // Кнопка увеличения количества
            increaseButton.textContent = '+';
            increaseButton.onclick = () => increaseQuantity(index); // Привязываем событие увеличения количества
            itemElement.appendChild(increaseButton);
            cartElement.appendChild(itemElement); // Добавляем товар в корзину
            totalPrice += itemTotal; // Считаем общую стоимость всех товаров
        });
        totalPriceElement.textContent = `Общая стоимость: ${totalPrice} руб.`; // Отображаем общую стоимость
        if (!document.querySelector('.deliveryMessage')) {
            totalPriceElement.insertAdjacentHTML('afterend', '<p class="deliveryMessage">Стоимость доставки вам сообщит Диспетчер</p>'); // Добавляем сообщение о доставке, если его нет
        }
        updateCartIconCount(); // Обновляем счётчик на иконке корзины
    }

    function updateCartIconCount() {
        const cartIcon = document.getElementById('cart-icon'); // Иконка корзины
        const cartCountElement = cartIcon.querySelector('#cart-count'); // Элемент для счётчика
        const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Считаем общее количество товаров в корзине
        cartCountElement.textContent = cartItemCount; // Отображаем количество товаров
        cartCountElement.style.display = cartItemCount > 0 ? 'inline-block' : 'none'; // Показываем или скрываем счётчик
    }

    function addToCart(name, price, quantity) {
        const existingItem = cartItems.find(item => item.name === name); // Проверяем, есть ли уже этот товар в корзине

        if (existingItem) {
            existingItem.quantity += quantity; // Если есть, увеличиваем количество
        } else {
            cartItems.push({ name, price, quantity }); // Если нет, добавляем новый товар
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Сохраняем корзину в localStorage
        updateCartIconCount(); // Обновляем счётчик на иконке корзины
        renderCart(); // Перерисовываем корзину
    }

    function removeFromCart(index) {
        cartItems.splice(index, 1); // Удаляем товар из корзины по индексу
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Сохраняем обновлённую корзину в localStorage
        renderCart(); // Перерисовываем корзину
        updateCartIconCount(); // Обновляем счётчик на иконке корзины
    }

    function decreaseQuantity(index) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--; // Уменьшаем количество товара на 1, если оно больше 1
            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Сохраняем обновлённую корзину в localStorage
            renderCart(); // Перерисовываем корзину
            updateCartIconCount(); // Обновляем счётчик на иконке корзины
        }
    }

    function increaseQuantity(index) {
        cartItems[index].quantity++; // Увеличиваем количество товара на 1
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Сохраняем обновлённую корзину в localStorage
        renderCart(); // Перерисовываем корзину
        updateCartIconCount(); // Обновляем счётчик на иконке корзины
    }
});
