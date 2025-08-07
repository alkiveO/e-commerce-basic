let keranjang = [];

// Ambil data dari localStorage saat halaman dimuat
function muatDariLocalStorage() {
    const data = localStorage.getItem("keranjang");
    if (data) {
        keranjang = JSON.parse(data);
    }
}

// Simpan data ke localStorage setiap kali keranjang diperbarui
function simpanKeLocalStorage() {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

async function ambilData() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        const displayhtml = document.getElementById("data-product");

        displayhtml.innerHTML = "";

        data.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = "product-card";
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div class="price-cart">
                    <h2>$${post.price}</h2>
                    <button class="cart-button">🛒</button>
                </div>
            `;

            const tombol = postElement.querySelector(".cart-button");
            tombol.addEventListener("click", () => tambahKeKeranjang(post));

            displayhtml.appendChild(postElement);
        });
    } catch (error) {
        console.error("Terjadi error", error);
        document.getElementById("data-product").innerHTML = "<p>Gagal memuat produk.</p>";
    }
}

function tambahKeKeranjang(item) {
    const existing = keranjang.find((produk) => produk.id === item.id);
    if (existing) {
        existing.jumlah += 1;
    } else {
        keranjang.push({ ...item, jumlah: 1 });
    }
    simpanKeLocalStorage(); // simpan perubahan
    renderKeranjang();
}

function ubahJumlah(index, delta) {
    keranjang[index].jumlah += delta;
    if (keranjang[index].jumlah <= 0) {
        keranjang.splice(index, 1);
    }
    simpanKeLocalStorage(); // simpan perubahan
    renderKeranjang();
}

function hapusItem(index) {
    keranjang.splice(index, 1);
    simpanKeLocalStorage(); // simpan perubahan
    renderKeranjang();
}

function renderKeranjang() {
    const keranjangContainer = document.getElementById("keranjang-list");
    keranjangContainer.innerHTML = "";

    if (keranjang.length === 0) {
        keranjangContainer.innerHTML = "<p>Keranjang kosong.</p>";
        return;
    }

    keranjang.forEach((item, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "keranjang-item";
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="info">
                <span>${item.title}</span>
                <strong>$${(item.price * item.jumlah).toFixed(2)} (${item.jumlah}x)</strong>
                <div class="jumlah-controls">
                    <button onclick="ubahJumlah(${index}, -1)">➖</button>
                    <button onclick="ubahJumlah(${index}, 1)">➕</button>
                </div>
            </div>
            <button onclick="hapusItem(${index})">❌</button>
        `;
        keranjangContainer.appendChild(itemEl);
    });
}

// Jalankan saat halaman dimuat
muatDariLocalStorage();
ambilData();
renderKeranjang();
