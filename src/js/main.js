

let products;
document.getElementById('login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const errorMessage = document.getElementById('error-message');

    if (email !== "" && password !== "") {
        // alert('Login successful!');
        fetchData()
        document.getElementById("login")?.classList.add("hidden")
        document.getElementById("prodcuts")?.classList.remove("hidden")
        const user = { email, password }
        localStorage.setItem("user", JSON.stringify(user))
        // Redirect to another page or perform any action you want upon successful login
    } else {
        errorMessage.textContent = 'Invalid username or password';
        // errorMessage.classList.remove("hidden");
    }
});



async function fetchData() {
    try {
        const { data, status } = await axios.get('https://dummyjson.com/products')
        // console.log(data, status);
        products = data.products;
        if (status == 200) {
            displayData(data.products);
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// add to cart fun
const addToCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const product = products.find(product => product.id === id);
    // console.log(product);
    const newItem = { ...product, amount: 1 }
    if (cart) {
        const cartItem = cart?.find(item => {
            return item.id === id
        })
        if (cartItem) {
            const newCart = cart.map((item) => {
                if (item.id === id) {

                    return { ...item, amount: cartItem.amount + 1 }
                } else {
                    return item;
                }
            });
            localStorage.setItem('cart', JSON.stringify(newCart));
        } else {
            localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
        }
    }

    // increase cart count
    increaseCart()
}

const increaseCart = () => {
    const data = JSON.parse(localStorage.getItem('cart'))
    // // console.log(data);
    // if (data) {
    //     const amount = data.reduce((accumulator, currentItem) => {
    //         return accumulator + currentItem.amount;
    //     }, 0);
    //     localStorage.setItem('amount', amount);
    //     document.getElementById('cart-num').innerText = ` ${localStorage.getItem('amount') | 0}`
    // }
    if (data) {
        let count = 0
        for (let i = 0; i < data.length; i++) {
            count += data[i]?.amount
        }
        // console.log(x);
        document.getElementById('cart-num').innerText = ` ${count | 0}`
    }

}


// Function to display the fetched data
function displayData(data) {
    // console.log(data);
    let container = document.querySelector('.products');
    let cartona = ``
    for (let i = 0; i < data.length; i++) {
        cartona += `<div class="bg-white border rounded-lg shadow-lg overflow-hidden">
        <img src=${data[i].images[0]} alt="${data[i].title}"
            class="w-full h-48 object-cover hover:scale-75 transition duration-150">
            
        <div class="p-4 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 line-clamp-1">${data[i].title}</h2>
            <p class="text-gray-500 mt-2 line-clamp-3">${data[i].description}</p>
            <div class="flex items-center mt-4">
                <span class="ml-2 text-gray-500">${data[i].price} $</span>
            </div>
            <button id='cart' onclick='addToCart(${data[i].id})' class="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add to
                Cart</button>
        </div>
    </div>`;
    }
    container.innerHTML = cartona;
    increaseCart()

    // check if ls is empty and create new one
    if (!JSON.parse(localStorage.getItem('cart'))) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// get total amountfor cart
const totalAmount = () => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const totalPayment = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price * currentItem.amount
    }, 0)
    document.querySelector('.total').innerText = `${Math.ceil(totalPayment)} $`;
}


const displayCart = () => {
    const data = JSON.parse(localStorage.getItem('cart'))

    let container = document.querySelector('.cart-list');

    let cartona = ``
    for (let i = 0; i < data.length; i++) {
        cartona += `<li class="flex items-center gap-4">
                            <img src="${data[i].images[0]}"
                                alt="${data[i].title}" class="size-24 rounded object-cover" />

                            <div>
                                <h3 class="text-md font-semibold text-gray-900">${data[i].title}</h3>
                                <div class="mt-0.5 space-y-px text-sm font-medium text-gray-600">
                                <div>
                                  <dt class="inline">Price:</dt>
                                  <dd class="inline">${(data[i].price * data[i].amount)} $</dd>
                                 </div>
                            </div>
                            </div>
                            
                            <div class="flex flex-1 items-center justify-end gap-2">
                                <form>
                                    <label for="Line1Qty" class="sr-only"> Quantity </label>

                                    <input type="number" min="1" value="${data[i].amount}" id="Line1Qty"
                                        class="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none" />
                                </form>

                                <button onclick='removeFromCart(${data[i].id})' class="text-gray-600 transition hover:text-red-600">
                                    <span class="sr-only">Remove item</span>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                        `;
    }
    container.innerHTML = cartona;
    totalAmount()
}

// log out
document.getElementById('logOut')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    document.location.reload();
})

// remove from cart
const removeFromCart = (id) => {
    // console.log(id);
    let cart = JSON.parse(localStorage.getItem('cart'));
    const newCart = cart.filter((item) => {
        return item.id !== id
    });
    localStorage.setItem('cart', JSON.stringify(newCart));
    displayCart()
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // console.log(document.location);
    if (localStorage.getItem('user') != null) {
        document.getElementById("login")?.classList.add("hidden")
        document.getElementById("prodcuts")?.classList.remove("hidden")
        if (document.baseURI.split('/').includes('cart.html')) {
            displayCart()
        } else {
            fetchData()
        }
    } else {
        document.getElementById("login")?.classList.remove("hidden")
        document.getElementById("prodcuts")?.classList.add("hidden")
        // console.log("out");
        if (document.baseURI.split('/').includes('cart.html')) {
            document.location.href = "./index.html";
        }

    }
});


