const citySelector = document.getElementById("citySelector");
const quizContainer = document.getElementById("quizContainer");
const pointTitle = document.getElementById("pointTitle");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

// NUEVO: Contador de puntos en la web
const scoreDisplay = document.createElement("div");
scoreDisplay.style.padding = "10px";
scoreDisplay.style.fontWeight = "bold";
scoreDisplay.style.fontSize = "16px";
scoreDisplay.style.background = "#fff";
scoreDisplay.style.textAlign = "center";
scoreDisplay.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
document.body.insertBefore(scoreDisplay, document.getElementById("map"));

let map = L.map("map").setView([38.79, 0.16], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

let respondedPoints = new Set();
let score = 0;

function loadCity(city) {
  quizContainer.classList.add("hidden");
  respondedPoints.clear();  // Opcional: borrar respuestas al cambiar ciudad si quieres

  fetch(`https://raw.githubusercontent.com/Hustea/CiudadesJson/${city}.json`)
    .then(res => res.json())
    .then(data => {
      map.setView([data.cityCenter.lat, data.cityCenter.lng], 15);

      // Limpia marcadores anteriores
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      data.points.forEach(point => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.on("click", () => showQuestion(point));
      });

      updateScoreDisplay();
    });
}

function showQuestion(point) {
  quizContainer.classList.remove("hidden");
  pointTitle.textContent = point.title;

  if (point.questions.length > 0) {
    const question = point.questions[0];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";

    const alreadyResponded = respondedPoints.has(point.title);

    question.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt;

      btn.disabled = alreadyResponded;

      btn.onclick = () => {
        // Desactiva todos los botones tras la primera respuesta
        const allButtons = optionsContainer.querySelectorAll("button");
        allButtons.forEach(b => b.disabled = true);

        if (index === question.answer) {
          btn.style.backgroundColor = "#b6f7b6";
          // Si no estaba respondido, suma punto
          if (!alreadyResponded) {
            score++;
            updateScoreDisplay();
          }
        } else {
          btn.style.backgroundColor = "#f8c0c0";
        }
        respondedPoints.add(point.title);
      };

      optionsContainer.appendChild(btn);
    });
  }
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Puntuación: ${score}`;
}

citySelector.addEventListener("change", () => {
  score = 0;           // Resetea puntuación al cambiar de ciudad
  loadCity(citySelector.value);
});

loadCity(citySelector.value);
