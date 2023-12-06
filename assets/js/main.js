function preuzmiPodatke(callback, server, method) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(JSON.parse(this.responseText));
    }
  });
  xhr.open(method, server);
  xhr.send();
  xhr.addEventListener("error", function () {
    console.log("error");
  });
}

preuzmiPodatke(ispis, "assets/js/DATA.JSON", "GET");

document.querySelector("#tbDeoModel").addEventListener("keyup", function () {
  preuzmiPodatke(ispis, "assets/js/DATA.JSON", "GET");
});
document.querySelector("#rnCena").addEventListener("change", function () {
  preuzmiPodatke(ispis, "assets/js/DATA.JSON", "GET");
});
let sort = 0;
let fleg = 0;

document.querySelector("#sortMarka").addEventListener("click", function () {
  fleg = 1;
  if (sort == 0) {
    sort = 1;
  } else {
    sort = 0;
  }
  preuzmiPodatke(ispis, "assets/js/DATA.JSON", "GET");
});

function ispis(data) {
  data = filterSlova(data);
  data = filterCene(data);
  data = filterSort(data);

  let ispis = ``;
  data.forEach((element) => {
    ispis += `<div class="blok">
        <img src="${element.slika.putanja}" alt="${element.slika.alt}" />
        <h3>${element.marka} - ${element.tipProizvoda} - ${element.model}</h3>`;
    if (element.popust == 0) {
      ispis += `<h4>${element.cena} RSD</h4>`;
    } else {
      ispis += `<s>${element.cena} RSD</s>
            <h4>${(
              element.cena -
              (element.cena * element.popust) / 100
            ).toFixed(2)} RSD</h4>`;
    }
    ispis += `<a class="korpaText" href="#" data-title="${element.marka}" data-id="${element.id}">DODAJ U KORPU</a>
    </div>`;
  });

  document.querySelector("#artikli").innerHTML = ispis;
  document.querySelectorAll(".korpaText").forEach((elem) => {
    elem.addEventListener("click", function (obj) {
      prikaziModal(obj, data);
    });
  });
}

function prikaziModal(obj, data) {
  let id = obj.target.dataset.id;
  let element = data.find((elem) => elem.id == id);
  console.log(element);
  let ispis = `<div class="modal-content blok">
    <span class="close">&times</span>
    <img src="${element.slika.putanja}" alt="${element.slika.alt}" />
    <h3>${element.marka} - ${element.tipProizvoda} - ${element.model}</h3>
    <ul>
        <li>Ekran: ${element.specifikacije.ekran}</li>
        <li>RAM: ${element.specifikacije.RAM}</li>
        <li>Procesor: ${element.specifikacije.procesor}</li>
        <li>Operativni sistem: ${element.specifikacije.operativniSistem}</li>
        <li>Kamera:
            <ul>
                <li>Prednja kamera: ${element.specifikacije.kamera.prednja}</li>
                <li>Zadnja kamera: ${element.specifikacije.kamera.zadnja}</li>
            </ul>
        </li>
    </ul>`;
  if (element.popust == 0) {
    ispis += `<h4>${element.cena} RSD</h4>`;
  } else {
    ispis += `<s>${element.cena} RSD</s>
        <h4>${(element.cena - (element.cena * element.popust) / 100).toFixed(
          2
        )} RSD</h4>`;
  }
  ispis += `<a class="korpaText" href="#" data-title="${element.marka}" data-id="${element.id}">DODAJ U KORPU</a>
</div>`;

  document.querySelector("#modal").innerHTML = ispis;
  document.querySelector("#modal").style.display = "block";

  document.querySelector(".close").addEventListener("click", function () {
    document.querySelector("#modal").style.display = "none";
    // document.querySelector("#modal").textContent = "";
  });
}

function filterSlova(data) {
  let vrednost = document.querySelector("#tbDeoModel").value;
  console.log(vrednost.trim());
  if (vrednost.trim() != "") {
    let noviData = data.filter((elem) => {
      if (
        elem.model.toLowerCase().indexOf(vrednost.toLowerCase().trim()) != -1
      ) {
        return elem;
      }
    });
    return noviData;
  } else {
    return data;
  }
}

function filterCene(data) {
  let cena = document.querySelector("#rnCena").value;

  document.querySelector("#cenaIzbor").textContent = cena;

  return data.filter((elem) => {
    let cenaP;
    if (elem.popust == 0) {
      cenaP = elem.cena;
    } else {
      cenaP = elem.cena - (elem.cena * elem.popust) / 100;
    }
    if (cenaP <= cena) {
      return elem;
    }
  });
}

function filterSort(data) {
  if (sort == 1 && fleg != 0) {
    data.sort((a, b) => {
      if (a.marka > b.marka) {
        return 1;
      }
      if (a.marka < b.marka) {
        return -1;
      }
      if (a.marka == b.marka) {
        return 0;
      }
    });
    document.querySelector("#sortMarka").value = "Sortiraj opadajuce";
    return data;
  } else if (sort == 0 && fleg != 0) {
    data.sort((a, b) => {
      if (a.marka < b.marka) {
        return 1;
      }
      if (a.marka > b.marka) {
        return -1;
      }
      if (a.marka == b.marka) {
        return 0;
      }
    });
    document.querySelector("#sortMarka").value = "Sortiraj rastuce";
    return data;
  } else {
    return data;
  }
}
