import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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


// Load Menu

async function loadMenu(){

    const menuDiv = document.getElementById("menu");

    const querySnapshot = await getDocs(collection(db,"Menu"));

    menuDiv.innerHTML="";

    querySnapshot.forEach((doc)=>{

        let item = doc.data();

        menuDiv.innerHTML += `
        <div class="menu-item">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <b>₹${item.price}</b>
            <br><br>
            <button onclick='addToCart("${item.name}",${item.price})'>
            Add to Cart
            </button>
        </div>
        `;

    });

}


// Add cart

window.addToCart = function(name,price){

    cart.push({
        name:name,
        price:price
    });

    total += price;

    document.getElementById("cart").innerHTML =
    cart.map(item=>item.name).join("<br>");

    document.getElementById("total").innerText = total;

}



// Place Order

window.placeOrder = async function(){

    let name=document.getElementById("name").value;
    let phone=document.getElementById("phone").value;
    let address=document.getElementById("address").value;


    await addDoc(collection(db,"Orders"),{

        customerName:name,
        phone:phone,
        address:address,
        items:cart,
        totalAmount:total,
        orderStatus:"New",
        createdAt:serverTimestamp()

    });


    alert("Order Placed Successfully! 🍕");

};


loadMenu();
