const citySelector = document.getElementById("citySelector");
const quizContainer = document.getElementById("quizContainer");
const pointTitle = document.getElementById("pointTitle");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

let map = L.map("map").setView([38.79, 0.16], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

function loadCity(city) {
  fetch(`https://raw.githubusercontent.com/Hustea/CiudadesJson/main/${city}.json`)
    .then(res => res.json())
    .then(data => {
      map.setView([data.cityCenter.lat, data.cityCenter.lng], 15);
      L.layerGroup().addTo(map); // limpiar anteriores si quieres

      data.points.forEach(point => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.on("click", () => showQuestion(point));
      });
    });
}

function showQuestion(point) {
  quizContainer.classList.remove("hidden");
  pointTitle.textContent = point.title;
  if (point.questions.length > 0) {
    const question = point.questions[0];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => {
        if (index === question.answer) {
          btn.style.backgroundColor = "#b6f7b6";
        } else {
          btn.style.backgroundColor = "#f8c0c0";
        }
      };
      optionsContainer.appendChild(btn);
    });
  }
}

citySelector.addEventListener("change", () => {
  quizContainer.classList.add("hidden");
  loadCity(citySelector.value);
});

loadCity(citySelector.value);
