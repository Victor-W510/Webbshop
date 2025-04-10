let allaProdukter = [];

document.addEventListener("DOMContentLoaded", e => {
    uppdateraKundvagnsRäknaren();
    uppdateraKundvagn();
    uppdateraKundvagnensTotala();

    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(e => {
            allaProdukter = e;
            visaProdukter(allaProdukter);
        });

    document.getElementById("HemIconen").addEventListener("click", () => {
        visaProdukter(allaProdukter);
    });

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            let kategori = button.getAttribute("data-category");
            filtreraProdukterna(kategori);
        });
    });
});

function visaProdukter(produkter) {
    let produktContainer = document.getElementById("products");
    produktContainer.innerHTML = "";
    let gridContainer = document.createElement("div");
    gridContainer.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mx-auto h-100";

    for (let i = 0; i < produkter.length; i++) {
        let produkten = produkter[i];

        let enskildProdukt = document.createElement("div");
        enskildProdukt.className = "col d-flex";

        let card = document.createElement("div");
        card.className = "border shadow-lg d-flex flex-column p-2 h-100";

        let titel = document.createElement("h5");
        titel.textContent = produkten.title;
        titel.classList.add("text-center", "my-4", "px-3");

        let bild = document.createElement("img");
        bild.src = produkten.image;
        bild.classList.add("img-fluid", "w-50", "mx-auto", "mt-auto");

        let pris_Kanpp_Bild = document.createElement("div");
        pris_Kanpp_Bild.className = "d-flex flex-column align-items-center mt-auto";

        let pris = document.createElement("p");
        pris.textContent = produkten.price + " $";
        pris.classList.add("fw-bold", "mb-2");

        let beställKnapp = document.createElement("button");
        beställKnapp.textContent = "Lägg till i Varukorg";
        beställKnapp.className = "btn btn-dark w-100";


        beställKnapp.addEventListener("click", e => {

            beställKnapp.textContent = "Lägger till...";

            let animationDiv = document.createElement("div");
            animationDiv.className = "tumme-animation";

            animationDiv.innerHTML = '<i class="bi bi-hand-thumbs-up-fill"></i> + 1';
            beställKnapp.parentElement.appendChild(animationDiv);

            setTimeout(() => animationDiv.remove(), 1000);

            let kundvagnsräknaren = localStorage.getItem('kundvagnAntal');
            kundvagnsräknaren = kundvagnsräknaren ? parseInt(kundvagnsräknaren) : 0;
            kundvagnsräknaren++;
            localStorage.setItem('kundvagnAntal', kundvagnsräknaren);

            läggTillIKundvagn(produkten)
            uppdateraKundvagnsRäknaren();
            uppdateraKundvagnensTotala();


            setTimeout(() => {
                beställKnapp.textContent = "Lägg till i Varukorg";
            }, 1000);
        });

        pris_Kanpp_Bild.appendChild(pris);
        pris_Kanpp_Bild.appendChild(beställKnapp);

        card.appendChild(titel);
        card.appendChild(bild);
        card.appendChild(pris_Kanpp_Bild);

        enskildProdukt.appendChild(card);
        gridContainer.appendChild(enskildProdukt);
    }

    produktContainer.appendChild(gridContainer);
}

function läggTillIKundvagn(produkt) {
    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];

    let produktIndex = kundvagn.findIndex(e => e.id === produkt.id);

    if (produktIndex !== -1) {
        kundvagn[produktIndex].antal += 1;
    } else {
        produkt.antal = 1;
        kundvagn.push(produkt);
    }

    localStorage.setItem('cart', JSON.stringify(kundvagn));

    uppdateraKundvagn();
    uppdateraKundvagnsRäknaren();
    uppdateraKundvagnensTotala();
}

function uppdateraKundvagnsRäknaren() {
    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];

    let totala = kundvagn.reduce((sum, i) => sum + i.antal, 0);

    const badge = document.getElementById("cart-badge");
    if (badge) {
        badge.textContent = totala;
        badge.style.display = totala > 0 ? "inline-block" : "none";
    }
}

function uppdateraKundvagnensTotala() {
    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];

    let totalPrice = kundvagn.reduce((sum, i) => sum + (i.price * (i.antal || 1)), 0);

    document.getElementById("pris").textContent = `Totalt: ${totalPrice.toFixed(2)} $`;
}

function uppdateraKundvagn() {
    let kundvagnLista = document.getElementById("lista");
    kundvagnLista.innerHTML = "";

    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];

    kundvagn.forEach((produkt, index) => {
        let enProdukt = document.createElement("div");
        enProdukt.className = "d-flex justify-content-between align-items-center border-bottom py-2";

        let totalaProduktPriset = produkt.price * produkt.antal;

        enProdukt.innerHTML = `
            <img src="${produkt.image}" class="me-2" width="50" height="50">
            <span>${produkt.title}</span>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary" onclick="ändraAntal(${index}, -1)">−</button>
                <span class="mx-2">${produkt.antal}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="ändraAntal(${index}, 1)">+</button>
            </div>
            <span class="fw-bold mx-2">${totalaProduktPriset.toFixed(2)} $</span> 
            <button class="btn btn-sm btn-warning ms-2" onclick="taBortProdukt(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;

        kundvagnLista.appendChild(enProdukt);
    });

    uppdateraKundvagnensTotala();
}

function ändraAntal(index, ändring) {

    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];

    if (!kundvagn[index].antal) {
        kundvagn[index].antal = 1;
    }
    kundvagn[index].antal += ändring;

    if (kundvagn[index].antal <= 0) {
        kundvagn.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(kundvagn));

    uppdateraKundvagn();
    uppdateraKundvagnsRäknaren();
    uppdateraKundvagnensTotala();
}



function taBortProdukt(index) {
    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];

    kundvagn.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(kundvagn));

    uppdateraKundvagn();
    uppdateraKundvagnsRäknaren();
    uppdateraKundvagnensTotala();
}

function tömKundvagn() {
    localStorage.removeItem('cart');

    uppdateraKundvagnsRäknaren();
    uppdateraKundvagnensTotala();
    uppdateraKundvagn();
}

function beställ() {

    let kundvagn = JSON.parse(localStorage.getItem('cart')) || [];
    localStorage.setItem('chosenProducts', JSON.stringify(kundvagn));
    location.href = "beställning.html";
}

function filtreraProdukterna(kategori) {

    let filtreradeProdukter = allaProdukter.filter(produkt => produkt.category === kategori);
    visaProdukter(filtreradeProdukter);

}


