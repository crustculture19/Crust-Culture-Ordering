import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC9jmrFTYlOyOPoQ9U3oc5tACuqOsSICeY",
  authDomain: "crust-culture-ordering.firebaseapp.com",
  projectId: "crust-culture-ordering",
  storageBucket: "crust-culture-ordering.firebasestorage.app",
  messagingSenderId: "364295196392",
  appId: "1:364295196392:web:ab65986314c6eb7d40c35d",
  measurementId: "G-4DTJZ9LS33"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let cart = [];
let total = 0;


// LOAD MENU

async function loadMenu(){

    const menuDiv = document.getElementById("menu");

    const snapshot = await getDocs(collection(db,"Menu"));

    menuDiv.innerHTML = "";

    snapshot.forEach((doc)=>{

        const item = doc.data();

        menuDiv.innerHTML += `

        <div class="menu-item">

            <h3>${item.Name}</h3>

            <p>${item.Description}</p>

            <b>₹${item.Price}</b>

            <br><br>

            <button class="add-btn">
                Add to Cart
            </button>

        </div>

        `;


        const button = menuDiv.lastElementChild.querySelector(".add-btn");


        button.onclick = function(){

            addToCart(
                item.Name,
                item.Price
            );

        };


    });


}



// ADD TO CART

function addToCart(name, price){

    console.log("Added:", name, price);

    let itemPrice = Number(price);

    cart.push({
        name: name,
        price: itemPrice
    });


    total = 0;

    cart.forEach(function(item){
        total = total + item.price;
    });


    let cartHTML = "";

    cart.forEach(function(item){

        cartHTML += `
        ${item.name} - ₹${item.price}
        <br>
        `;

    });


    document.getElementById("cart").innerHTML = cartHTML;

    document.getElementById("total").innerText = total;

}



// PLACE ORDER

window.placeOrder = async function(){

    let customerName =
    document.getElementById("name").value;


    let phone =
    document.getElementById("phone").value;


    let address =
    document.getElementById("address").value;



    await addDoc(collection(db,"Orders"),{

        customerName: customerName,

        phone: phone,

        address: address,

        items: cart,

        totalAmount: total,

        orderStatus:"New",

        createdAt: serverTimestamp()

    });


    alert("Order Placed Successfully 🍕");


    cart = [];
    total = 0;


    document.getElementById("cart").innerHTML =
    "Cart is empty";


    document.getElementById("total").innerText = 0;

};



loadMenu();
